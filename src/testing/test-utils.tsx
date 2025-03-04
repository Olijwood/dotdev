import {
    render as rtlRender,
    screen,
    renderHook,
    act,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, ReactNode } from "react";
import { test, expect, describe, vi, Mock } from "vitest";
import Provider from "@/app/provider"; // Ensure this points to your actual Provider

const render = (
    ui: ReactElement,
    {
        providerProps,
        ...renderOptions
    }: { providerProps?: Record<string, unknown> } & Parameters<
        typeof rtlRender
    >[1] = {},
) => {
    return rtlRender(ui, {
        wrapper: ({ children }: { children: ReactNode }) => (
            <Provider {...providerProps}>{children}</Provider>
        ),
        ...renderOptions,
    });
};

// ✅ Mocking utilities (replace Jest `jest.fn()` with `vi.fn()`)
export {
    render,
    renderHook,
    act,
    userEvent,
    screen,
    waitFor,
    waitForElementToBeRemoved,
    test,
    expect,
    describe,
    vi,
};

export type { Mock };
