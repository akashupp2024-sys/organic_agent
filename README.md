# OrganicStore - Fresh Organic Produce E-Commerce Platform

A modern, responsive e-commerce web application built with React, Vite, Tailwind CSS, and React Router DOM. OrganicStore connects conscious consumers with sustainable, certified organic farmers.

## 🌱 Features

### Core Functionality
- **Product Catalog**: Browse 12+ organic products across multiple categories (Vegetables, Fruits, Dairy, Pantry)
- **Advanced Filtering**: Filter by category, price range, and customer rating
- **Product Search**: Real-time search by product name or category
- **Sorting Options**: Sort by price (ascending/descending), rating, or newest
- **Dynamic Product Detail Pages**: Full product information with image gallery and related products
- **Shopping Cart**: Add/remove items, adjust quantities, persistent cart state using React Context
- **Checkout**: Complete checkout flow with delivery address form and payment method selection
- **Multi-Page Navigation**: Seamless routing with React Router DOM

### Pages
- **Home**: Hero section, featured categories, benefits showcase, customer testimonials carousel, newsletter signup
- **Shop**: Product grid with advanced filtering and sorting
- **Product Detail**: Full product information with gallery, description, and related products
- **Cart**: Review items, adjust quantities, and proceed to checkout
- **Checkout**: Address form validation, payment method selection, order summary
- **About**: Company story, team members, mission statement, and core values
- **Contact**: Contact form with validation, map embed, business information

### UI/UX Enhancements
- **Responsive Design**: Fully responsive from mobile to desktop (mobile-first approach)
- **Custom Theme**: Brand green (#4CAF50) with complementary colors
- **Tailwind CSS**: Utility-first styling with custom configuration
- **Google Fonts**: Poppins font for modern typography
- **Interactive Components**: Hover states, transitions, and smooth interactions
- **Form Validation**: Real-time validation with user-friendly error messages
- **Auto-Carousel**: Testimonials section with auto-play and manual navigation

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.1
- **CSS Framework**: Tailwind CSS 3.4.5
- **Routing**: React Router DOM 6.14.2
- **State Management**: React Context API
- **Package Manager**: npm

## 📋 Project Structure

```
organic-agent/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation header with cart badge
│   │   ├── ProductCard.jsx  # Product display card
│   │   └── Footer.jsx       # Site footer with links
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Homepage with hero and sections
│   │   ├── Shop.jsx         # Product listing with filters
│   │   ├── ProductDetail.jsx # Individual product page
│   │   ├── Cart.jsx         # Shopping cart
│   │   ├── Checkout.jsx     # Checkout flow
│   │   ├── About.jsx        # About page
│   │   ├── Contact.jsx      # Contact page
│   │   └── NotFound.jsx     # 404 page
│   ├── context/             # React Context for state management
│   │   ├── CartContext.jsx  # Cart state and functions
│   │   └── AppContext.jsx   # App-level state
│   ├── data/                # Static data
│   │   ├── products.js      # Product catalog
│   │   ├── testimonials.js  # Customer testimonials
│   │   └── sampleData.js    # Sample data
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── vercel.json              # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)


   ```



## 📊 Product Categories
- Vegetables
- Fruits
- Dairy
- Pantry
- Bakery (empty - ready for products)
- Beverages (empty - ready for products)


## 📝 Features Implemented

### Shopping Features
- ✅ Product catalog with 12 items
- ✅ Category-based filtering
- ✅ Price range filtering
- ✅ Rating-based filtering
- ✅ Product search
- ✅ Multiple sort options
- ✅ Shopping cart with Context API
- ✅ Add to cart functionality
- ✅ Remove from cart
- ✅ Update quantities
- ✅ Cart total calculation
- ✅ Checkout with address form
- ✅ Payment method selection

### User Experience
- ✅ Fully responsive design
- ✅ Mobile-first approach
- ✅ Smooth navigation
- ✅ Form validation with error messages
- ✅ Auto-carousel testimonials
- ✅ Newsletter signup
- ✅ Product detail pages
- ✅ Related products suggestions
- ✅ 404 error page
- ✅ Consistent UI/UX

### SEO
- ✅ Meta tags for search engines
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Semantic HTML
- ✅ Descriptive page titles

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built by [Akash pandey]

Made with 💚 for organic, sustainable living.
