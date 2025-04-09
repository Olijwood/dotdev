-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availableFor" VARCHAR(200) DEFAULT '',
ADD COLUMN     "brandColour" VARCHAR(7) DEFAULT '',
ADD COLUMN     "currentlyHackingOn" VARCHAR(200) DEFAULT '',
ADD COLUMN     "currentlyLearning" VARCHAR(200) DEFAULT '',
ADD COLUMN     "displayEmailOnProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "education" VARCHAR(100) DEFAULT '',
ADD COLUMN     "location" VARCHAR(100) DEFAULT '',
ADD COLUMN     "pronouns" VARCHAR(200) DEFAULT '',
ADD COLUMN     "skillsLanguages" VARCHAR(200) DEFAULT '',
ADD COLUMN     "websiteUrl" VARCHAR(100) DEFAULT '',
ADD COLUMN     "work" VARCHAR(100) DEFAULT '';
