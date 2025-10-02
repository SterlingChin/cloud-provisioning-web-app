# Cloud Infrastructure Provisioning App

A modern web application for managing and provisioning cloud infrastructure using AI assistance, built with Next.js and styled-components.

## Features

- 🎨 **Postman Brand Colors** - Built with Postman's signature orange (#FF6C37) and brown (#150903) color scheme
- 🤖 **AI-Powered Provisioning** - Chat interface for natural language resource creation
- 💻 **Terminal Display** - Visual terminal showing AI command execution
- 📦 **Resource Management** - Manage servers, databases, storage, and networking resources
- 🔌 **Postman Mock API Integration** - Connected to Postman mock servers for testing
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Styled Components
- **API**: Postman Mock Servers
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
cloud-provisioning-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard
│   ├── servers/           # Servers page
│   ├── databases/         # Databases page
│   ├── storage/           # Storage page
│   ├── networking/        # Networking page
│   └── provision/         # AI provisioning interface
├── components/            # React components
│   ├── Layout.tsx         # Main layout with sidebar
│   ├── ResourceCard.tsx   # Resource display card
│   ├── ChatInterface.tsx  # Chat UI component
│   ├── Terminal.tsx       # Terminal display component
│   └── Button.tsx         # Reusable button component
├── lib/                   # Utilities
│   └── api.ts            # API client for Postman mock servers
├── styles/               # Styling
│   ├── theme.ts          # Theme configuration
│   └── GlobalStyles.tsx  # Global styles
└── types/                # TypeScript types
    └── index.ts          # Type definitions
```

## Usage

### Dashboard
The dashboard provides an overview of your infrastructure and quick action buttons to provision new resources.

### Resource Pages
- **Servers**: View and manage EC2-like server instances
- **Databases**: Manage database instances
- **Storage**: Manage storage buckets
- **Networking**: Manage VPCs and network resources

### Provisioning Interface
Click "Provision New [Resource]" to access the AI-powered provisioning interface:
- **Chat Panel**: Describe what you want to create in natural language
- **Terminal Panel**: Watch the AI execute commands to provision your resources

## API Integration

The app uses Postman Mock Server:
- **Base URL**: `https://1d8ea325-fef8-4dcf-babf-a86a03eaa444.mock.pstmn.io`
- **Collections**: Cloud Infrastructure Provisioning API - Mocked

## Deployment

Deploy to Vercel:

```bash
npm run build
```

The app is optimized for Vercel deployment with Next.js App Router.

## Color Scheme

- **Primary Orange**: #FF6C37
- **Secondary Brown**: #150903
- **Background**: #F9F9F9
- **Text**: #150903

## Future Enhancements

- Real AWS API integration
- Authentication and authorization
- Error handling and notifications
- Resource monitoring dashboards
- Real AI integration for provisioning
- Resource tagging and filtering

## License

MIT
