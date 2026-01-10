# Task 001: Environment Preparation (Dependencies)

**Priority:** Critical (Blocker)
**Status:** Pending

## Objective
Install the necessary libraries to support the new Architecture (Routing & Type Safety).

## Constraints
*   **The environment has strict Execution Policies.** Standard `npm install` WILL FAIL.
*   You MUST use the PowerShell Bypass command.

## Required Packages
*   `react-router-dom`: For standard SPA routing.
*   `clsx`, `tailwind-merge`: For robust class handling (crucial for the Design System).
*   `date-fns`: For reliable date formatting.

## Action Plan
1.  **Execute the following command** in the terminal:
    ```powershell
    powershell -ExecutionPolicy Bypass -Command "npm install react-router-dom clsx tailwind-merge date-fns"
    ```
2.  **Verify Installation**:
    *   Check `package.json` to ensure they are listed in dependencies.
    *   Restart the dev server to ensure no breaks: `powershell -ExecutionPolicy Bypass -Command "npm run dev"`

## Definition of Done
*   `react-router-dom` is present in `package.json`.
*   Dev server runs without errors.
