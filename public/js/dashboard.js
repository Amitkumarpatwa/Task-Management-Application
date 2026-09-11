document.addEventListener('DOMContentLoaded', function () {
    var taskList = document.getElementById('taskList');
    var noTasks = document.getElementById('noTasks');
    var addTaskForm = document.getElementById('addTaskForm');
    var taskError = document.getElementById('taskError');
    var taskSuccess = document.getElementById('taskSuccess');
    var logoutBtn = document.getElementById('logoutBtn');
    var userNameEl = document.getElementById('userName');
    var editModal = document.getElementById('editModal');
    var editTaskForm = document.getElementById('editTaskForm');
    var cancelEdit = document.getElementById('cancelEdit');

    // check auth and load user info
    fetch('/api/auth/me')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.loggedIn) {
                window.location.href = '/';
                return;
            }
            userNameEl.textContent = 'Hello, ' + data.user.name;
            loadTasks();
        })
        .catch(function () {
            window.location.href = '/';
        });

    // load tasks
    function loadTasks() {
        fetch('/api/tasks')
            .then(function (res) { return res.json(); })
            .then(function (tasks) {
                renderTasks(tasks);
            })
            .catch(function () {
                showTaskError('Failed to load tasks');
            });
    }

    // render tasks into table
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        var tableWrapper = document.getElementById('taskTableWrapper');

        if (tasks.length === 0) {
            noTasks.style.display = 'block';
            if (tableWrapper) tableWrapper.style.display = 'none';
            return;
        }

        noTasks.style.display = 'none';
        if (tableWrapper) tableWrapper.style.display = 'block';

        tasks.forEach(function (task, index) {
            var tr = document.createElement('tr');

            var statusClass = 'status-' + task.status;
            var statusText = task.status.charAt(0).toUpperCase() + task.status.slice(1);
            if (task.status === 'in-progress') statusText = 'In Progress';

            var createdDate = new Date(task.createdAt).toLocaleDateString();

            tr.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td>' + escapeHtml(task.title) + '</td>' +
                '<td>' + escapeHtml(task.description || '-') + '</td>' +
                '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
                '<td>' + createdDate + '</td>' +
                '<td>' +
                '<div class="task-actions">' +
                '<button class="btn btn-edit btn-sm" data-id="' + task._id + '">Edit</button>' +
                '<button class="btn btn-danger btn-sm" data-id="' + task._id + '">Delete</button>' +
                '</div>' +
                '</td>';

            // edit button
            tr.querySelector('.btn-edit').addEventListener('click', function () {
                openEditModal(task);
            });

            // delete button
            tr.querySelector('.btn-danger').addEventListener('click', function () {
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(task._id);
                }
            });

            taskList.appendChild(tr);
        });
    }

    // add task
    addTaskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        hideTaskMessages();

        var title = addTaskForm.querySelector('[name="title"]').value.trim();
        var description = addTaskForm.querySelector('[name="description"]').value.trim();
        var status = addTaskForm.querySelector('[name="status"]').value;

        if (!title) {
            showTaskError('Task title is required');
            return;
        }

        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: status })
        })
            .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
            .then(function (result) {
                if (result.status === 201) {
                    addTaskForm.reset();
                    showTaskSuccess('Task added successfully');
                    loadTasks();
                } else {
                    showTaskError(result.data.message || 'Failed to add task');
                }
            })
            .catch(function () {
                showTaskError('Something went wrong');
            });
    });

    // delete task
    function deleteTask(id) {
        fetch('/api/tasks/' + id, { method: 'DELETE' })
            .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
            .then(function (result) {
                if (result.status === 200) {
                    showTaskSuccess('Task deleted');
                    loadTasks();
                } else {
                    showTaskError(result.data.message || 'Failed to delete task');
                }
            })
            .catch(function () {
                showTaskError('Something went wrong');
            });
    }

    // edit modal
    function openEditModal(task) {
        document.getElementById('editTaskId').value = task._id;
        document.getElementById('editTitle').value = task.title;
        document.getElementById('editDescription').value = task.description || '';
        document.getElementById('editStatus').value = task.status;
        editModal.classList.add('active');
    }

    cancelEdit.addEventListener('click', function () {
        editModal.classList.remove('active');
    });

    editModal.addEventListener('click', function (e) {
        if (e.target === editModal) {
            editModal.classList.remove('active');
        }
    });

    editTaskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var id = document.getElementById('editTaskId').value;
        var title = document.getElementById('editTitle').value.trim();
        var description = document.getElementById('editDescription').value.trim();
        var status = document.getElementById('editStatus').value;

        if (!title) {
            alert('Task title is required');
            return;
        }

        fetch('/api/tasks/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: status })
        })
            .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
            .then(function (result) {
                if (result.status === 200) {
                    editModal.classList.remove('active');
                    showTaskSuccess('Task updated');
                    loadTasks();
                } else {
                    alert(result.data.message || 'Failed to update task');
                }
            })
            .catch(function () {
                alert('Something went wrong');
            });
    });

    // logout
    logoutBtn.addEventListener('click', function () {
        fetch('/api/auth/logout', { method: 'POST' })
            .then(function () {
                window.location.href = '/';
            })
            .catch(function () {
                window.location.href = '/';
            });
    });

    // helpers
    function showTaskError(msg) {
        taskError.textContent = msg;
        taskError.style.display = 'block';
        setTimeout(function () { taskError.style.display = 'none'; }, 4000);
    }

    function showTaskSuccess(msg) {
        taskSuccess.textContent = msg;
        taskSuccess.style.display = 'block';
        setTimeout(function () { taskSuccess.style.display = 'none'; }, 3000);
    }

    function hideTaskMessages() {
        taskError.style.display = 'none';
        taskSuccess.style.display = 'none';
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
});
