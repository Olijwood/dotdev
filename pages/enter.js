import { useContext, useEffect, useState, useCallback } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, writeBatch, getDoc } from "firebase/firestore";
import debounce from "lodash.debounce";
import styles from "./styles/Enter.module.css";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };
  return (
    <button className={styles["btn-google"]} onClick={signInWithGoogle}>
      <img src={"/google.png"} alt="Google Logo" width="30px" />
      Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(firestore, `users/${user.uid}`);
    const usernameDoc = doc(firestore, `usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`);
        const docSnapshot = await getDoc(ref);
        setIsValid(!docSnapshot.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose username:</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button
            type="submit"
            disabled={!formValue}
            className={styles["btn-green"]}
          >
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {username}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className={styles["text-success"]}>{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className={styles["text-danger"]}>That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
