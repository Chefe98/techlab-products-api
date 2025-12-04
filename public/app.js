// Configuración global
const CONFIG = {
    API_BASE: 'http://localhost:3000/api',
    ENDPOINTS: {
        LOGIN: '/users/login',
        REGISTER: '/users',
        PRODUCTS: '/products',
        CREATE_PRODUCT: '/products/create',
        UPDATE_PRODUCT: '/products',
        DELETE_PRODUCT: '/products',
        USERS: '/users'
    }
};

// Estado de la aplicación
const state = {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    products: [],
    editingProduct: null
};

const utils = {
    showMessage(containerId, message, type = 'info') {
        const container = document.getElementById(containerId);
        const types = {
            success: 'message-success',
            error: 'message-error',
            warning: 'message-warning'
        };
        
        container.innerHTML = `
            <div class="message ${types[type] || ''}">
                ${message}
            </div>
        `;
        
        // Scroll automático al mensaje para que sea visible
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    },

    //Mostrar mensaje flash cerca del elemento
    showFlashMessage(nearElementId, message, type = 'error') {
        const nearElement = document.getElementById(nearElementId);
        if (!nearElement) return;
        
        // Crear mensaje flash
        const flashMessage = document.createElement('div');
        flashMessage.className = `flash-message flash-${type}`;
        flashMessage.innerHTML = `
            <div class="flash-content">
                <span class="flash-icon">${type === 'error' ? '❌' : '⚠️'}</span>
                <span class="flash-text">${message}</span>
                <button class="flash-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Insertar después del elemento referenciado
        nearElement.parentNode.insertBefore(flashMessage, nearElement.nextSibling);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (flashMessage.parentNode) {
                flashMessage.remove();
            }
        }, 5000);
        
        // Scroll al mensaje
        setTimeout(() => {
            flashMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    },

    formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    },

    toggleElement(id, show) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle('hidden', !show);
        }
    },

    setLoading(element, isLoading) {
        if (element) {
            element.classList.toggle('loading', isLoading);
        }
    },

    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
};

// Módulo de Autenticación
const auth = {
    init() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }
        
        if (state.token && state.user) {
            this.showDashboard();
        }
    },

    showRegister() {
        document.getElementById('loginForm').closest('.card').classList.add('hidden');
        document.getElementById('registerCard').classList.remove('hidden');
        document.getElementById('authMessage').innerHTML = '';
        document.getElementById('registerMessage').innerHTML = '';
    },

    showLogin() {
        document.getElementById('registerCard').classList.add('hidden');
        document.getElementById('loginForm').closest('.card').classList.remove('hidden');
        document.getElementById('authMessage').innerHTML = '';
        document.getElementById('registerMessage').innerHTML = '';
    },

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            utils.showMessage('authMessage', 'Por favor completa todos los campos', 'error');
            return;
        }

        try {
            const loginButton = event.target.querySelector('button[type="submit"]');
            const originalText = loginButton.textContent;
            loginButton.textContent = '⏳ Iniciando sesión...';
            loginButton.disabled = true;

            const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.setSession(data.data);
                utils.showMessage('authMessage', '✅ Login exitoso! Redirigiendo...', 'success');
                setTimeout(() => this.showDashboard(), 1000);
            } else {
                utils.showMessage('authMessage', data.message || 'Error en el login', 'error');
            }
        } catch (error) {
            utils.showMessage('authMessage', 'Error de conexión con el servidor', 'error');
            console.error('Login error:', error);
        } finally {
            const loginButton = event.target.querySelector('button[type="submit"]');
            loginButton.textContent = 'Ingresar al Sistema';
            loginButton.disabled = false;
        }
    },

    async handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            utils.showMessage('registerMessage', 'Por favor completa todos los campos', 'error');
            return;
        }

        if (password !== confirmPassword) {
            utils.showMessage('registerMessage', 'Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            utils.showMessage('registerMessage', 'La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        try {
            const registerButton = event.target.querySelector('button[type="submit"]');
            const originalText = registerButton.textContent;
            registerButton.textContent = '⏳ Creando cuenta...';
            registerButton.disabled = true;

            const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    role: 'customer'
                })
            });

            const data = await response.json();

            if (data.success) {
                utils.showMessage('registerMessage', '✅ ¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', 'success');
                event.target.reset();
                
                setTimeout(() => {
                    document.getElementById('loginEmail').value = email;
                    this.showLogin();
                }, 2000);
                
            } else {
                utils.showMessage('registerMessage', data.message || 'Error en el registro', 'error');
            }
        } catch (error) {
            utils.showMessage('registerMessage', 'Error de conexión con el servidor', 'error');
            console.error('Register error:', error);
        } finally {
            const registerButton = event.target.querySelector('button[type="submit"]');
            registerButton.textContent = 'Crear Cuenta';
            registerButton.disabled = false;
        }
    },

    setSession(authData) {
        state.token = authData.token.access_token;
        state.user = authData.user;
        
        localStorage.setItem('token', state.token);
        localStorage.setItem('user', JSON.stringify(state.user));
    },

    showDashboard() {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('dashboardSection').classList.remove('hidden');
        this.displayUserInfo();
        products.loadProducts();
    },

    displayUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (state.user) {
            userInfo.innerHTML = `
                <div class="user-info-item">
                    <strong>Nombre:</strong>
                    <span>${state.user.name}</span>
                </div>
                <div class="user-info-item">
                    <strong>Email:</strong>
                    <span>${state.user.email}</span>
                </div>
                <div class="user-info-item">
                    <strong>Rol:</strong>
                    <span>${state.user.role}</span>
                </div>
                <div class="user-info-item">
                    <strong>ID:</strong>
                    <span>${state.user.id}</span>
                </div>
                ${state.user.role === 'admin' ? `
                <div class="user-info-item">
                    <button class="btn btn-secondary btn-sm" onclick="users.loadUsers()">
                        👥 Ver Todos los Usuarios
                    </button>
                </div>
                ` : ''}
            `;
        }
    },

    logout() {
        state.token = null;
        state.user = null;
        state.products = [];
        state.editingProduct = null;
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        document.getElementById('dashboardSection').classList.add('hidden');
        document.getElementById('authSection').classList.remove('hidden');
        
        this.showLogin();
        
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        document.getElementById('createProductForm').reset();
        document.getElementById('productsList').innerHTML = '';
        
        products.cancelEdit();
        
        utils.showMessage('authMessage', 'Sesión cerrada correctamente', 'success');
    }
};

// Módulo de Usuarios 
const users = {
    async loadUsers() {
        if (!state.token) {
            utils.showFlashMessage('userInfo', '🔐 Debes iniciar sesión para ver usuarios', 'error');
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.USERS}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.displayUsers(data.data);
            } else {
                utils.showFlashMessage('userInfo', data.message || 'Error al cargar usuarios', 'error');
            }
        } catch (error) {
            console.error('Load users error:', error);
            utils.showFlashMessage('userInfo', 'Error de conexión al cargar usuarios', 'error');
        }
    },

    displayUsers(usersList) {
        const usersHTML = usersList.map(user => `
            <div class="user-card" style="border: 1px solid #ddd; padding: 1rem; margin: 0.5rem 0; border-radius: 8px;">
                <h4>${user.name}</h4>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Rol:</strong> ${user.role}</p>
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Activo:</strong> ${user.is_active ? 'Sí' : 'No'}</p>
                <p><strong>Registrado:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
            </div>
        `).join('');

        alert(`Usuarios del sistema:\n\n${usersList.map(user => 
            `👤 ${user.name} (${user.email}) - ${user.role}`
        ).join('\n')}`);
    }
};

// Módulo de Productos
const products = {
    init() {
        const createForm = document.getElementById('createProductForm');
        if (createForm) {
            createForm.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleFormSubmit(event);
            });
        }
    },

    async loadProducts() {
        try {
            const productsList = document.getElementById('productsList');
            const refreshButton = document.querySelector('button[onclick="products.loadProducts()"]');
            
            utils.setLoading(productsList, true);
            if (refreshButton) {
                refreshButton.textContent = '🔄 Cargando...';
                refreshButton.disabled = true;
            }

            const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.PRODUCTS}`);
            const data = await response.json();

            if (data.success) {
                state.products = data.data;
                this.displayProducts();
                utils.showMessage('productsMessage', `✅ ${data.data.length} productos cargados`, 'success');
            } else {
                utils.showMessage('productsMessage', data.message || 'Error al cargar productos', 'error');
            }
        } catch (error) {
            utils.showMessage('productsMessage', 'Error de conexión al cargar productos', 'error');
            console.error('Load products error:', error);
        } finally {
            const productsList = document.getElementById('productsList');
            const refreshButton = document.querySelector('button[onclick="products.loadProducts()"]');
            
            utils.setLoading(productsList, false);
            if (refreshButton) {
                refreshButton.textContent = '🔄 Actualizar Lista';
                refreshButton.disabled = false;
            }
        }
    },

    displayProducts() {
        const productsList = document.getElementById('productsList');
        
        if (state.products.length === 0) {
            productsList.innerHTML = `
                <div class="text-center">
                    <p>No hay productos disponibles</p>
                    <button class="btn btn-secondary" onclick="products.loadProducts()">Intentar de nuevo</button>
                </div>
            `;
            return;
        }

        productsList.innerHTML = state.products.map(product => `
            <article class="product-card" data-product-id="${product.id}">
                <h3>${product.name}</h3>
                <p><strong>Categoría:</strong> ${product.category || 'Sin categoría'}</p>
                <p><strong>Stock disponible:</strong> ${product.stock || 0} unidades</p>
                <p class="product-price">${utils.formatPrice(product.price)}</p>
                <p><small><strong>ID:</strong> ${product.id}</small></p>
                ${product.description ? `<p><em>${product.description}</em></p>` : ''}
                
                <!-- Mostrar botones de acción solo para administradores -->
                ${state.user && state.user.role === 'admin' ? `
                <div class="product-actions">
                    <button class="btn btn-secondary btn-sm" onclick="products.startEdit('${product.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="products.deleteProduct('${product.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
                ` : `
                <!-- NUEVO: Mensaje para usuarios no admin -->
                <div class="product-notice">
                    <small>💡 Solo administradores pueden gestionar productos</small>
                </div>
                `}
            </article>
        `).join('');
    },

    async handleFormSubmit(event) {
        event.preventDefault();
        
        if (!state.token) {
            utils.showFlashMessage('createProductForm', '🔐 Debes iniciar sesión para gestionar productos', 'error');
            return;
        }

        // Verificar si es admin
        if (state.user.role !== 'admin') {
            utils.showFlashMessage('createProductForm', '⛔ Se requieren permisos de administrador', 'error');
            return;
        }

        const productData = {
            name: document.getElementById('productName').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value.trim() || 'general',
            stock: parseInt(document.getElementById('productStock').value) || 10,
            description: document.getElementById('productDescription').value.trim() || ''
        };

        // Validaciones
        if (!productData.name || !productData.price) {
            utils.showFlashMessage('createProductForm', '❌ Nombre y precio son campos requeridos', 'error');
            return;
        }

        if (productData.price < 0) {
            utils.showFlashMessage('createProductForm', '❌ El precio no puede ser negativo', 'error');
            return;
        }

        if (productData.stock < 0) {
            utils.showFlashMessage('createProductForm', '❌ El stock no puede ser negativo', 'error');
            return;
        }

        if (productData.name.length < 2) {
            utils.showFlashMessage('createProductForm', '❌ El nombre debe tener al menos 2 caracteres', 'error');
            return;
        }

        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = '⏳ Procesando...';
        submitButton.disabled = true;

        try {
            if (state.editingProduct) {
                await this.updateProduct(productData);
            } else {
                await this.createProduct(productData);
            }
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    },

    async createProduct(productData) {
        try {
            console.log('Creando producto:', productData);
            
            const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.CREATE_PRODUCT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            console.log('Respuesta crear:', data);

            if (data.success) {
                utils.showMessage('productsMessage', '✅ Producto creado exitosamente!', 'success');
                document.getElementById('createProductForm').reset();
                this.loadProducts();
                setTimeout(() => utils.scrollToElement('productsContainer'), 300);
            } else {
                utils.showFlashMessage('createProductForm', data.message || 'Error al crear producto', 'error');
            }
        } catch (error) {
            console.error('Create product error:', error);
            utils.showFlashMessage('createProductForm', 'Error de conexión al crear producto', 'error');
        }
    },

    startEdit(productId) {
        // Verificar permisos
        if (!state.token || state.user.role !== 'admin') {
            utils.showFlashMessage('productsList', '⛔ Se requieren permisos de administrador para editar', 'error');
            return;
        }

        console.log('Iniciando edición del producto:', productId);
        
        const product = state.products.find(p => p.id === productId);
        if (!product) {
            console.error('Producto no encontrado:', productId);
            utils.showFlashMessage('productsList', 'Producto no encontrado', 'error');
            return;
        }

        state.editingProduct = product;

        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('productStock').value = product.stock || 10;
        document.getElementById('productDescription').value = product.description || '';

        const submitButton = document.getElementById('createProductForm').querySelector('button[type="submit"]');
        submitButton.textContent = '💾 Actualizar Producto';
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-warning');
        
        utils.toggleElement('cancelEditBtn', true);
        
        setTimeout(() => {
            utils.scrollToElement('createProductForm');
        }, 100);
        
        utils.showMessage('productsMessage', `Editando: ${product.name}`, 'warning');
    },

    cancelEdit() {
        console.log('Cancelando edición');
        
        state.editingProduct = null;
        document.getElementById('createProductForm').reset();
        
        const submitButton = document.getElementById('createProductForm').querySelector('button[type="submit"]');
        submitButton.textContent = '➕ Crear Producto';
        submitButton.classList.remove('btn-warning');
        submitButton.classList.add('btn-primary');
        
        utils.toggleElement('cancelEditBtn', false);
        utils.showMessage('productsMessage', 'Edición cancelada', 'info');
        
        setTimeout(() => utils.scrollToElement('createProductForm'), 100);
    },

    async updateProduct(productData) {
        try {
            console.log('Actualizando producto:', state.editingProduct.id, productData);
            
            const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.UPDATE_PRODUCT}/${state.editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            console.log('Respuesta actualizar:', data);

            if (data.success) {
                utils.showMessage('productsMessage', '✅ Producto actualizado exitosamente!', 'success');
                this.cancelEdit();
                this.loadProducts();
            } else {
                utils.showFlashMessage('createProductForm', data.message || 'Error al actualizar producto', 'error');
            }
        } catch (error) {
            console.error('Update product error:', error);
            utils.showFlashMessage('createProductForm', 'Error de conexión al actualizar producto', 'error');
        }
    },

    async deleteProduct(productId) {
        // Verificar permisos
        if (!state.token || state.user.role !== 'admin') {
            utils.showFlashMessage('productsList', '⛔ Se requieren permisos de administrador para eliminar', 'error');
            return;
        }

        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        if (!confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`)) {
            return;
        }

        try {
            console.log('Eliminando producto:', productId);
            
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            const deleteButton = productCard?.querySelector('.btn-danger');
            if (deleteButton) {
                deleteButton.textContent = '⏳ Eliminando...';
                deleteButton.disabled = true;
            }

            const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.DELETE_PRODUCT}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            });

            const data = await response.json();
            console.log('Respuesta eliminar:', data);

            if (data.success) {
                utils.showMessage('productsMessage', '✅ Producto eliminado exitosamente!', 'success');
                this.loadProducts();
            } else {
                utils.showFlashMessage('productsList', data.message || 'Error al eliminar producto', 'error');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            utils.showFlashMessage('productsList', 'Error de conexión al eliminar producto', 'error');
        }
    }
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    auth.init();
    products.init();
    
    console.log('🚀 TechLab Dashboard inicializado');
});