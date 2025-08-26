# Store Locator

A professional, modular store locator implementation with ZIP code search, distance calculation, and responsive design. Ready for Vercel deployment and Shopify integration.

## 🚀 Features

- **ZIP Code Search**: Find nearest stores by entering a ZIP code
- **Distance Calculation**: Accurate distance calculation using Haversine formula
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional UI**: Clean, modern interface with smooth animations
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Optimized with local caching and efficient algorithms
- **Modular Architecture**: Separated HTML, CSS, and JavaScript for easy maintenance
- **Vercel Ready**: Deploy directly to Vercel with zero configuration
- **Shopify Compatible**: Easy integration into Shopify themes

## 📁 Project Structure

```
store-locator/
├── index.html                  # Main HTML file (Vercel entry point)
├── css/
│   └── store-locator.css       # Styles with CSS variables
├── js/
│   └── store-locator.js        # JavaScript module
└── README.md                   # This file
```

## 🛠 Quick Start

### Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/store-locator.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically - no configuration needed!

### Local Development

Simply open `index.html` in your browser - no server required!

```bash
# Or use any simple server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 🎯 Usage

### Basic Implementation

The store locator is ready to use out of the box. Simply include the files in your project:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/store-locator.css">
</head>
<body>
    <!-- Your content -->
    <script src="js/store-locator.js"></script>
</body>
</html>
```

### Programmatic Control

You can control the store locator programmatically:

```javascript
// Show the modal
StoreLocator.showModal();

// Hide the modal
StoreLocator.hideModal();

// Search by ZIP code
StoreLocator.searchByZip();

// Get nearest stores for coordinates
const stores = StoreLocator.getNearestStores(lat, lng, 5);
```

## 🛒 Shopify Integration

### Method 1: Direct Integration

1. **Upload files** to your Shopify theme:
   - Copy `css/store-locator.css` to your theme's `assets/` folder
   - Copy `js/store-locator.js` to your theme's `assets/` folder

2. **Include in your theme**:
   ```liquid
   <!-- In your theme.liquid or specific template -->
   {{ 'store-locator.css' | asset_url | stylesheet_tag }}
   {{ 'store-locator.js' | asset_url | script_tag }}
   ```

3. **Add HTML structure** to your template:
   ```liquid
   <div class="store-locator-section" id="store-locator-section">
       <button class="store-locator-trigger" id="open-locator">
           Select a preferred store
       </button>
       <!-- Rest of the modal HTML -->
   </div>
   ```

### Method 2: Shopify Section

Create a new section file `sections/store-locator.liquid`:

```liquid
{% comment %}
  Store Locator Section for Shopify
{% endcomment %}

{{ 'store-locator.css' | asset_url | stylesheet_tag }}

<div class="store-locator-section" id="store-locator-section-{{ section.id }}">
    <!-- Copy the HTML structure from index.html -->
</div>

{{ 'store-locator.js' | asset_url | script_tag }}

{% schema %}
{
  "name": "Store Locator",
  "settings": [
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Select a preferred store"
    }
  ],
  "presets": [
    {
      "name": "Store Locator"
    }
  ]
}
{% endschema %}
```

## 🎨 Customization

### CSS Variables

The design is fully customizable using CSS custom properties:

```css
:root {
  /* Colors */
  --sl-primary-color: #dc2626;
  --sl-primary-hover: #b91c1c;
  --sl-text-color: #111827;
  
  /* Typography */
  --sl-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --sl-font-size-base: 16px;
  
  /* Spacing */
  --sl-spacing-md: 12px;
  --sl-spacing-lg: 16px;
  
  /* Border Radius */
  --sl-radius-md: 8px;
  --sl-radius-lg: 12px;
}
```

### Store Data

Update the store locations in `js/store-locator.js`:

```javascript
const STORES = [
    { 
        name: "Your Store", 
        slug: "your-store", 
        address: "123 Main St", 
        city: "Your City", 
        state: "ST", 
        zip: "12345", 
        lat: 40.7128, 
        lng: -74.0060
    }
    // Add more stores...
];
```

### Configuration

Modify the configuration object in `js/store-locator.js`:

```javascript
const CONFIG = {
    ZIP_API_URL: 'https://api.zippopotam.us/us/',
    ZIP_API_TIMEOUT: 10000,
    MAX_RESULTS: 2,
    ANIMATION_DURATION: 300,
    // ... more options
};
```

## 🔧 API Reference

### StoreLocator Object

| Method | Description | Parameters |
|--------|-------------|------------|
| `init()` | Initialize the store locator | None |
| `showModal()` | Show the store locator modal | None |
| `hideModal()` | Hide the store locator modal | None |
| `searchByZip()` | Trigger ZIP code search | None |
| `getNearestStores(lat, lng, limit)` | Get nearest stores | `lat`, `lng`, `limit` (optional) |

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ZIP_API_URL` | string | `'https://api.zippopotam.us/us/'` | ZIP code geocoding API URL |
| `ZIP_API_TIMEOUT` | number | `10000` | API request timeout in milliseconds |
| `MAX_RESULTS` | number | `2` | Maximum number of stores to show |
| `ANIMATION_DURATION` | number | `300` | Animation duration in milliseconds |

## 🌐 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Internet Explorer**: Not supported

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support with Tab, Enter, and Escape keys
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Proper focus handling and visible focus indicators

## 📱 Responsive Design

The store locator is fully responsive with breakpoints at:

- **Desktop**: 769px and above
- **Tablet**: 481px - 768px
- **Mobile**: 480px and below

## 🔒 Security

- **Input Validation**: ZIP codes are validated before processing
- **XSS Protection**: All user input is properly escaped
- **API Security**: Uses HTTPS for all external API calls
- **Error Handling**: Graceful error handling without exposing sensitive information

## 🚀 Performance

- **Local Caching**: ZIP codes for store locations are cached locally
- **Efficient Algorithms**: Optimized distance calculation
- **Minimal Dependencies**: No external libraries required
- **Lazy Loading**: Resources load only when needed

## 🧪 Testing

To test the store locator:

1. **Open** `index.html` in your browser
2. **Click** the "Select a preferred store" button
3. **Enter** a ZIP code (e.g., "19102" for Philadelphia)
4. **Verify** the results show the nearest stores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:

1. Check the [Issues](https://github.com/yourusername/store-locator/issues) page
2. Create a new issue with a detailed description
3. Include browser version and console errors if applicable

## 🔄 Changelog

### Version 1.0.0
- Initial release
- ZIP code search functionality
- Distance calculation
- Responsive design
- Accessibility features
- Professional UI/UX
- Vercel deployment ready
- Shopify integration support

## 🙏 Acknowledgments

- [Zippopotam.us](https://zippopotam.us/) for free ZIP code geocoding API
- [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) for distance calculation
- Modern CSS features for responsive design
- [Vercel](https://vercel.com) for seamless deployment
