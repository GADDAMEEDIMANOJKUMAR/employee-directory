 
        // Mock Data
        let mockEmployees = [
            { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', department: 'HR', role: 'Manager' },
            { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', department: 'IT', role: 'Developer' },
            { id: 3, firstName: 'Charlie', lastName: 'Lee', email: 'charlie@example.com', department: 'Finance', role: 'Analyst' },
            { id: 4, firstName: 'Diana', lastName: 'Brown', email: 'diana@example.com', department: 'Marketing', role: 'Designer' },
            { id: 5, firstName: 'Eve', lastName: 'Davis', email: 'eve@example.com', department: 'IT', role: 'Developer' },
            { id: 6, firstName: 'Frank', lastName: 'Wilson', email: 'frank@example.com', department: 'HR', role: 'Analyst' },
            { id: 7, firstName: 'Grace', lastName: 'Taylor', email: 'grace@example.com', department: 'Finance', role: 'Manager' },
            { id: 8, firstName: 'Henry', lastName: 'Anderson', email: 'henry@example.com', department: 'Marketing', role: 'Designer' },
            { id: 9, firstName: 'Ivy', lastName: 'Thomas', email: 'ivy@example.com', department: 'IT', role: 'Manager' },
            { id: 10, firstName: 'Jack', lastName: 'Jackson', email: 'jack@example.com', department: 'HR', role: 'Developer' }
        ];

        // Application State
        let currentPage = 1;
        let itemsPerPage = 10;
        let currentEmployees = [...mockEmployees];
        let editingEmployeeId = null;

        // DOM Elements
        const employeeGrid = document.getElementById('employeeGrid');
        const pagination = document.getElementById('pagination');
        const searchInput = document.getElementById('searchInput');
        const filterBtn = document.getElementById('filterBtn');
        const addBtn = document.getElementById('addBtn');
        const filterSidebar = document.getElementById('filterSidebar');
        const employeeModal = document.getElementById('employeeModal');
        const employeeForm = document.getElementById('employeeForm');
        const modalTitle = document.getElementById('modalTitle');
        const saveBtn = document.getElementById('saveBtn');
        const sortBy = document.getElementById('sortBy');
        const itemsPerPageSelect = document.getElementById('itemsPerPage');

        // Initialize Application
        function init() {
            renderEmployees();
            bindEvents();
        }

        // Bind Event Listeners
        function bindEvents() {
            // Search functionality
            searchInput.addEventListener('input', handleSearch);
            
            // Filter functionality
            filterBtn.addEventListener('click', toggleFilterSidebar);
            document.getElementById('applyFilters').addEventListener('click', applyFilters);
            document.getElementById('resetFilters').addEventListener('click', resetFilters);
            
            // Modal functionality
            addBtn.addEventListener('click', () => openModal());
            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('cancelBtn').addEventListener('click', closeModal);
            employeeForm.addEventListener('submit', handleFormSubmit);
            
            // Sort and pagination
            sortBy.addEventListener('change', handleSort);
            itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
            
            // Close filter sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!filterSidebar.contains(e.target) && !filterBtn.contains(e.target)) {
                    filterSidebar.classList.remove('open');
                }
            });
            
            // Close modal when clicking outside
            employeeModal.addEventListener('click', (e) => {
                if (e.target === employeeModal) {
                    closeModal();
                }
            });
        }

        // Render Employees
        function renderEmployees() {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const employeesToShow = currentEmployees.slice(startIndex, endIndex);

            employeeGrid.innerHTML = employeesToShow.map(employee => `
                <div class="employee-card">
                    <h3>${employee.firstName} ${employee.lastName}</h3>
                    <p><strong>ID:</strong> ${employee.id}</p>
                    <p><strong>Email:</strong> ${employee.email}</p>
                    <p><strong>Department:</strong> ${employee.department}</p>
                    <p><strong>Role:</strong> ${employee.role}</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editEmployee(${employee.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Delete</button>
                    </div>
                </div>
            `).join('');

            renderPagination();
        }

        // Render Pagination
        function renderPagination() {
            const totalPages = Math.ceil(currentEmployees.length / itemsPerPage);
            let paginationHTML = '';

            // Previous button
            paginationHTML += `
                <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                    Previous
                </button>
            `;

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                        ${i}
                    </button>
                `;
            }

            // Next button
            paginationHTML += `
                <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            `;

            pagination.innerHTML = paginationHTML;
        }

        // Change Page
        function changePage(page) {
            const totalPages = Math.ceil(currentEmployees.length / itemsPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderEmployees();
            }
        }

        // Handle Search
        function handleSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            currentEmployees = mockEmployees.filter(employee => 
                employee.firstName.toLowerCase().includes(searchTerm) ||
                employee.lastName.toLowerCase().includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            renderEmployees();
        }

        // Toggle Filter Sidebar
        function toggleFilterSidebar() {
            filterSidebar.classList.toggle('open');
        }

        // Apply Filters
        function applyFilters() {
            const filterFirstName = document.getElementById('filterFirstName').value.toLowerCase();
            const filterDepartment = document.getElementById('filterDepartment').value;
            const filterRole = document.getElementById('filterRole').value;

            currentEmployees = mockEmployees.filter(employee => {
                const matchesFirstName = !filterFirstName || employee.firstName.toLowerCase().includes(filterFirstName);
                const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
                const matchesRole = !filterRole || employee.role === filterRole;
                
                return matchesFirstName && matchesDepartment && matchesRole;
            });

            currentPage = 1;
            renderEmployees();
            filterSidebar.classList.remove('open');
        }

        // Reset Filters
        function resetFilters() {
            document.getElementById('filterFirstName').value = '';
            document.getElementById('filterDepartment').value = '';
            document.getElementById('filterRole').value = '';
            currentEmployees = [...mockEmployees];
            currentPage = 1;
            renderEmployees();
        }

        // Handle Sort
        function handleSort() {
            const sortValue = sortBy.value;
            if (sortValue) {
                currentEmployees.sort((a, b) => {
                    return a[sortValue].localeCompare(b[sortValue]);
                });
                currentPage = 1;
                renderEmployees();
            }
        }

        // Handle Items Per Page Change
        function handleItemsPerPageChange() {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            renderEmployees();
        }

        // Open Modal
        function openModal(employee = null) {
            editingEmployeeId = employee ? employee.id : null;
            modalTitle.textContent = employee ? 'Edit Employee' : 'Add Employee';
            saveBtn.textContent = employee ? 'Update' : 'Add';
            
            if (employee) {
                document.getElementById('firstName').value = employee.firstName;
                document.getElementById('lastName').value = employee.lastName;
                document.getElementById('email').value = employee.email;
                document.getElementById('department').value = employee.department;
                document.getElementById('role').value = employee.role;
            } else {
                employeeForm.reset();
            }
            
            clearErrors();
            employeeModal.classList.add('show');
        }

        // Close Modal
        function closeModal() {
            employeeModal.classList.remove('show');
            editingEmployeeId = null;
            employeeForm.reset();
            clearErrors();
        }

        // Handle Form Submit
        function handleFormSubmit(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const formData = new FormData(employeeForm);
                const employeeData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    department: formData.get('department'),
                    role: formData.get('role')
                };

                if (editingEmployeeId) {
                    updateEmployee(editingEmployeeId, employeeData);
                } else {
                    addEmployee(employeeData);
                }
                
                closeModal();
            }
        }

        // Validate Form
        function validateForm() {
            let isValid = true;
            clearErrors();

            // Validate first name
            const firstName = document.getElementById('firstName').value.trim();
            if (!firstName) {
                showError('firstName', 'First name is required');
                isValid = false;
            }

            // Validate last name
            const lastName = document.getElementById('lastName').value.trim();
            if (!lastName) {
                showError('lastName', 'Last name is required');
                isValid = false;
            }

            // Validate email
            const email = document.getElementById('email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            // Validate department
            const department = document.getElementById('department').value;
            if (!department) {
                showError('department', 'Department is required');
                isValid = false;
            }

            // Validate role
            const role = document.getElementById('role').value;
            if (!role) {
                showError('role', 'Role is required');
                isValid = false;
            }

            return isValid;
        }

        // Show Error
        function showError(fieldName, message) {
            const errorElement = document.getElementById(fieldName + 'Error');
            const fieldElement = document.getElementById(fieldName);
            
            errorElement.textContent = message;
            fieldElement.parentElement.classList.add('has-error');
        }

        // Clear Errors
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error');
            const fieldGroups = document.querySelectorAll('.form-group');
            
            errorElements.forEach(el => el.textContent = '');
            fieldGroups.forEach(group => group.classList.remove('has-error'));
        }

        // Add Employee
        function addEmployee(employeeData) {
            const newEmployee = {
                id: Math.max(...mockEmployees.map(e => e.id), 0) + 1,
                ...employeeData
            };
            
            mockEmployees.push(newEmployee);
            currentEmployees = [...mockEmployees];
            renderEmployees();
        }

        // Update Employee
        function updateEmployee(id, employeeData) {
            const index = mockEmployees.findIndex(emp => emp.id === id);
            if (index !== -1) {
                mockEmployees[index] = { ...mockEmployees[index], ...employeeData };
                currentEmployees = [...mockEmployees];
                renderEmployees();
            }
        }

        // Edit Employee
        function editEmployee(id) {
            const employee = mockEmployees.find(emp => emp.id === id);
            if (employee) {
                openModal(employee);
            }
        }

        // Delete Employee
        function deleteEmployee(id) {
            if (confirm('Are you sure you want to delete this employee?')) {
                mockEmployees = mockEmployees.filter(emp => emp.id !== id);
                currentEmployees = [...mockEmployees];
                renderEmployees();
            }
        }

        // Initialize the application
        init();
    