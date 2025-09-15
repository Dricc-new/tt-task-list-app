# Technical Test - Task Test Frontend (Vue 3 + Quasar)

Este proyecto es el **frontend** del sistema de gestión de tareas con keywords, desarrollado en **Vue 3 + Quasar**. Permite crear, editar, eliminar y marcar tareas como completadas, así como asociar keywords dinámicamente.

---

## 🔹 Especificaciones del proyecto

- **Framework:** Vue 3 + Composition API  
- **UI:** Quasar Framework  
- **Componentes clave:**  
  - `TaskForm.vue` → Crear/editar tareas con keywords  
  - `TaskItem.vue` → Mostrar tareas individuales con estado y keywords  
  - `TasksList.vue` → Contenedor principal con scroll dinámico y tareas cargadas  


## 🔹 Instalación y configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/Dricc-new/tt-task-list-app.git
cd frontend
````

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

* Crear un archivo `.env` basado en `.env.example`
* Definir la URL del backend:

```env
VITE_API_URL=http://localhost:8000/api
```

4. **Arrancar en modo desarrollo**

```bash
npm run dev
```

5. **Compilar para producción**

```bash
npm run build
```

* Los archivos finales se generarán en `dist/spa`

---

## 🔹 Comportamiento del frontend

* **Keywords dinámicas:**

  * Puedes añadir nuevas keywords directamente desde el `q-select`
  * Las keywords se sincronizan con el backend
  * Manejo de keywords existentes y nuevas en el mismo formulario

* **Tareas:**

  * Crear, editar, eliminar, toggle completado
  * Botón de crear tarea siempre visible

* **Manejo de errores y notificaciones:**

  * Cada operación dispara notificaciones con Quasar
  * Compatible con entornos de desarrollo y producción
