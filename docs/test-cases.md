# Test Case Documentation - Task Management Application

## 1. Registration Module

### Test Scenario: User Registration

| Test ID | Test Case | Steps | Expected Result | Type |
|---------|-----------|-------|-----------------|------|
| REG-001 | Register with valid details | 1. Go to /register 2. Enter name: "John Doe" 3. Enter email: "john@example.com" 4. Enter password: "password123" 5. Enter confirm password: "password123" 6. Click Register | User is registered and redirected to dashboard | Positive |
| REG-002 | Register with empty name field | 1. Go to /register 2. Leave name empty 3. Fill other fields correctly 4. Click Register | Error message: "All fields are required" | Negative |
| REG-003 | Register with empty email field | 1. Go to /register 2. Fill name 3. Leave email empty 4. Fill password fields 5. Click Register | Error message: "All fields are required" | Negative |
| REG-004 | Register with empty password | 1. Go to /register 2. Fill name and email 3. Leave password empty 4. Click Register | Error message: "All fields are required" | Negative |
| REG-005 | Register with mismatched passwords | 1. Go to /register 2. Fill all fields 3. Enter password: "pass123" 4. Enter confirm password: "pass456" 5. Click Register | Error message: "Passwords do not match" | Negative |
| REG-006 | Register with password less than 6 characters | 1. Go to /register 2. Fill all fields 3. Enter password: "abc" 4. Enter confirm password: "abc" 5. Click Register | Error message: "Password must be at least 6 characters" | Negative |
| REG-007 | Register with already existing email | 1. Register with email "john@example.com" 2. Try registering again with same email | Error message: "Email already registered" | Negative |
| REG-008 | Register with invalid email format | 1. Go to /register 2. Enter email: "notanemail" 3. Fill other fields 4. Click Register | Browser validation prevents submission or server rejects invalid email | Negative |
| REG-009 | Register with very long name (255+ chars) | 1. Go to /register 2. Enter a name with 300 characters 3. Fill other fields correctly 4. Click Register | Registration should either succeed with truncated name or show appropriate error | Edge |
| REG-010 | Register with special characters in name | 1. Go to /register 2. Enter name: "O'Brien-Smith" 3. Fill other fields 4. Click Register | Registration should succeed - special characters in names are valid | Edge |
| REG-011 | Register with spaces-only name | 1. Go to /register 2. Enter name: "   " (only spaces) 3. Fill other fields 4. Click Register | Should show error - name cannot be blank/whitespace only | Edge |
| REG-012 | Register with email containing uppercase | 1. Go to /register 2. Enter email: "John@Example.COM" 3. Fill other fields 4. Click Register | Registration succeeds, email should be stored in lowercase | Edge |

---

## 2. Login Module

### Test Scenario: User Login

| Test ID | Test Case | Steps | Expected Result | Type |
|---------|-----------|-------|-----------------|------|
| LOG-001 | Login with valid credentials | 1. Go to / (login page) 2. Enter registered email 3. Enter correct password 4. Click Login | User is logged in and redirected to dashboard | Positive |
| LOG-002 | Login with empty email | 1. Go to login page 2. Leave email empty 3. Enter password 4. Click Login | Error message: "Email and password are required" | Negative |
| LOG-003 | Login with empty password | 1. Go to login page 2. Enter email 3. Leave password empty 4. Click Login | Error message: "Email and password are required" | Negative |
| LOG-004 | Login with wrong password | 1. Go to login page 2. Enter valid email 3. Enter wrong password 4. Click Login | Error message: "Invalid email or password" | Negative |
| LOG-005 | Login with unregistered email | 1. Go to login page 2. Enter email that is not registered 3. Enter any password 4. Click Login | Error message: "Invalid email or password" | Negative |
| LOG-006 | Login with both fields empty | 1. Go to login page 2. Leave both fields empty 3. Click Login | Error message about required fields | Negative |
| LOG-007 | Login with correct email but different case | 1. Register with "user@test.com" 2. Login with "USER@TEST.COM" | Login should succeed (email comparison should be case-insensitive) | Edge |
| LOG-008 | Login with SQL injection attempt | 1. Go to login page 2. Enter email: "admin' OR '1'='1" 3. Enter any password 4. Click Login | Should not allow login, show "Invalid email or password" | Edge |
| LOG-009 | Access dashboard without login | 1. Open /dashboard directly without logging in | Should redirect to login page or show unauthorized message | Edge |
| LOG-010 | Login session persistence | 1. Login successfully 2. Close browser tab 3. Open /dashboard again | User should still be logged in (session cookie active) | Edge |
| LOG-011 | Logout functionality | 1. Login successfully 2. Click Logout button | User is logged out and redirected to login page | Positive |
| LOG-012 | Access dashboard after logout | 1. Login 2. Logout 3. Press browser back button or visit /dashboard | Should redirect to login page | Edge |

---

## 3. Task CRUD Operations

### Test Scenario: Create Task

| Test ID | Test Case | Steps | Expected Result | Type |
|---------|-----------|-------|-----------------|------|
| TSK-001 | Create task with title only | 1. Login 2. Enter task title: "Buy groceries" 3. Leave description empty 4. Status: Pending 5. Click Add Task | Task is created and appears in the list | Positive |
| TSK-002 | Create task with title and description | 1. Login 2. Enter title: "Meeting prep" 3. Enter description: "Prepare slides for Monday" 4. Status: Pending 5. Click Add Task | Task is created with all details visible in list | Positive |
| TSK-003 | Create task with "In Progress" status | 1. Login 2. Enter title 3. Select status: "In Progress" 4. Click Add Task | Task is created with "In Progress" status badge | Positive |
| TSK-004 | Create task with "Completed" status | 1. Login 2. Enter title 3. Select status: "Completed" 4. Click Add Task | Task is created with "Completed" status badge | Positive |
| TSK-005 | Create task with empty title | 1. Login 2. Leave title empty 3. Click Add Task | Error message: "Task title is required" | Negative |
| TSK-006 | Create task with whitespace-only title | 1. Login 2. Enter title: "   " (spaces only) 3. Click Add Task | Error message: title is required / cannot be empty | Negative |

### Test Scenario: View Task List

| Test ID | Test Case | Steps | Expected Result | Type |
|---------|-----------|-------|-----------------|------|
| TSK-007 | View tasks when no tasks exist | 1. Login with new account 2. Go to dashboard | "No tasks yet" message is displayed | Positive |
| TSK-008 | View tasks after creating multiple tasks | 1. Login 2. Create 3 tasks | All 3 tasks are displayed in the table with correct details | Positive |
| TSK-009 | Tasks should only show current user's tasks | 1. Login as User A, create a task 2. Logout 3. Login as User B | User B should not see User A's tasks | Positive |
| TSK-010 | Task list order | 1. Create multiple tasks at different times | Tasks should be displayed in reverse chronological order (newest first) | Edge |

### Test Scenario: Edit Task

| Test ID | Test Case | Steps | Expected Result | Type |
|---------|-----------|-------|-----------------|------|
| TSK-011 | Edit task title | 1. Click Edit on a task 2. Change title to "Updated title" 3. Click Save | Task title is updated in the list | Positive |
| TSK-012 | Edit task description | 1. Click Edit on a task 2. Change description 3. Click Save | Task description is updated | Positive |
| TSK-013 | Edit task status | 1. Click Edit on a task 2. Change status from Pending to Completed 3. Click Save | Task status badge updates to "Completed" | Positive |
| TSK-014 | Edit task with empty title | 1. Click Edit 2. Clear the title field 3. Click Save | Error message: title cannot be empty | Negative |
| TSK-015 | Cancel edit | 1. Click Edit on a task 2. Make changes 3. Click Cancel | Modal closes, task remains unchanged | Positive |

### Test Scenario: Delete Task

| Test ID | Test Case | Steps | Expected Result | Type |
|---------|-----------|-------|-----------------|------|
| TSK-016 | Delete a task | 1. Click Delete on a task 2. Confirm deletion | Task is removed from the list | Positive |
| TSK-017 | Cancel delete confirmation | 1. Click Delete on a task 2. Click Cancel on confirm dialog | Task remains in the list | Positive |
| TSK-018 | Delete all tasks | 1. Delete each task one by one | All tasks removed, "No tasks yet" message shown | Edge |

---

## 4. Input Validation & Error Handling

| Test ID | Test Case | Steps | Expected Result | Type |
|---------|-----------|-------|-----------------|------|
| VAL-001 | XSS attack in task title | 1. Create task with title: `<script>alert('xss')</script>` | Script should not execute, title displayed as plain text | Edge |
| VAL-002 | HTML injection in description | 1. Create task with description: `<b>bold</b><img src=x onerror=alert(1)>` | HTML should be escaped and displayed as text | Edge |
| VAL-003 | Very long task title (1000+ chars) | 1. Enter a title with 1000+ characters 2. Click Add Task | Task should be created or show appropriate length error | Edge |
| VAL-004 | Special characters in all fields | 1. Use characters like `!@#$%^&*()` in title and description | Should be accepted and displayed correctly | Edge |
| VAL-005 | Server unavailable | 1. Stop the backend server 2. Try to login or create task | User-friendly error message should be shown | Edge |
| VAL-006 | Concurrent task creation | 1. Rapidly click "Add Task" multiple times | Should not create duplicate tasks, or should handle gracefully | Edge |
| VAL-007 | Invalid task ID in URL/API | 1. Send PUT/DELETE request with non-existent task ID | Should return 404 "Task not found" | Negative |
| VAL-008 | Modify another user's task | 1. Login as User A 2. Get task ID of User B's task 3. Send PUT request | Should return 404 (task not found for this user) | Edge |
| VAL-009 | Session expiry | 1. Login 2. Wait for session to expire (or clear cookies) 3. Try to create a task | Should return 401 and redirect to login | Edge |
| VAL-010 | Unicode/emoji in task fields | 1. Create task with title: "📋 Task with émojis 日本語" | Should be stored and displayed correctly | Edge |
