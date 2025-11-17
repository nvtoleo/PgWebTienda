# 🏆 SportEct 2.0 - E-Commerce Deportivo

![Estado del Proyecto](https://img.shields.io/badge/Estado-Finalizado-success)
![Versión](https://img.shields.io/badge/Versión-2.0.0-blue)
![Tecnología](https://img.shields.io/badge/Stack-HTML%20%7C%20Bootstrap%20%7C%20JS-orange)

**SportEct** es una aplicación web de comercio electrónico simulada, enfocada en equipamiento deportivo de alto rendimiento. Este proyecto demuestra la implementación de un flujo de compra completo en el lado del cliente (Client-Side), desde la selección de productos hasta la generación de facturas en PDF, sin necesidad de un backend.

---

## ✨ Características Principales

### 🛍️ Experiencia de Compra
* **Catálogo Dinámico:** Renderizado de productos basado en una base de datos local simulada (`sportDB`).
* **Filtrado en Tiempo Real:** Búsqueda por nombre y filtrado por categorías (Fútbol, Gym, Running).
* **Detalle de Producto:** Modal interactivo con selección de tallas (S, M, L, XL) y control de cantidad.

### ⚙️ Funcionalidades Técnicas
* **🎨 Modo Oscuro (Dark Mode):** Implementación nativa usando **CSS Variables** y persistencia de preferencia del usuario.
* **🛒 Carrito Persistente:** Uso de `localStorage` para mantener los productos en el carrito incluso si se recarga la página.
* **🧾 Facturación Automática:** Integración con la librería **jsPDF** para generar tickets de compra en formato térmico (80mm) descargables.
* **📱 Diseño Responsive:** Interfaz totalmente adaptable a móviles, tablets y escritorio usando **Bootstrap 5**.

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5 Semántico, CSS3 (Variables & Flexbox).
* **Framework CSS:** Bootstrap 5.3 (Sistema de Grillas y Componentes).
* **Lógica:** JavaScript Moderno (ES6+).
* **Librerías Externas:**
    * [FontAwesome 6](https://fontawesome.com/) (Iconografía).
    * [jsPDF](https://github.com/parallax/jsPDF) (Generación de PDF).
    * [Google Fonts](https://fonts.google.com/) (Tipografías Roboto y Teko).

---

## 🚀 Instalación y Uso

Este proyecto es estático, por lo que no requiere instalación de dependencias de Node.js ni servidores complejos.

1.  **Clonar o Descargar** el repositorio.
2.  **Abrir** el archivo `index.html` en tu navegador web favorito (Chrome, Firefox, Edge).
    * *Recomendación:* Usar la extensión "Live Server" en VS Code para una mejor experiencia.

---

## 📂 Estructura del Proyecto

```text
SportEct/
├── index.html      # Estructura semántica y maquetación (Bootstrap)
├── styles.css      # Estilos personalizados, variables de tema y animaciones
├── script.js       # Lógica de negocio, base de datos simulada y manejo del DOM
└── README.md       # Documentación técnica
