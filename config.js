/**
 * Grambytes Nexus — Data Analytics Mentor / Trainer Application Website Configuration
 * Edit this file to customize text, branding, contacts, and links.
 */
const CONFIG = {
  // Company and general branding details
  companyName: "Grambytes Nexus",
  logoText: "Grambytes Nexus",
  
  // Google Apps Script Web App Deployment URL
  // PASTE YOUR DEPLOYED WEB APP URL HERE
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbzTJEDXbWjg8U9bYtD01gPlf8LKV6axfDbSwEaEEP8_sxFhHWc7GwDlNUbt-j1PqDjMJQ/exec", 

  // Navigation Links
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About Role", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Why Join Us", href: "#why-join" },
    { label: "Apply Now", href: "#application" },
    { label: "Contact", href: "#contact" }
  ],

  contact: {
    email: "contact@aiinstitutesatana.in",
    phone: "+91 8390576960",
    location: "Opposite of sandip transport, Satana",
    socials: [
      { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
      { name: "GitHub", url: "https://github.com", icon: "github" }
    ]
  },

  // Hero Section content
  hero: {
    badge: "Nexus Hiring Campaign",
    title: "We're Hiring — Data Analytics Mentor / Trainer",
    subtitle: "Turn data into insights. Build your career with us.",
    description: "Are you passionate about teaching, training, or mentoring future data professionals? Join Grambytes Nexus to lead cohorts, conduct code analysis, and design real-world projects in Remote and Hybrid modes.",
    ctaPrimary: "Apply Now",
    ctaSecondary: "Explore Opportunity",
    ctaNote: "Fill out the custom application form below to apply directly."
  },

  // About the Role Section (Mentoring / Training focused)
  aboutRole: {
    title: "About the Role",
    subtitle: "What you will do as a Data Analytics Mentor / Trainer",
    description: "As a Mentor or Trainer, your primary goal is to guide students through data methodologies, SQL writing, and dashboard storytelling. Your responsibilities include:",
    cards: [
      {
        icon: "presentation-chart",
        title: "Cohort Training",
        description: "Deliver interactive workshops on SQL, Excel, and Power BI. Answer technical doubts and demystify statistical formulas."
      },
      {
        icon: "brain",
        title: "Project Mentorship",
        description: "Guide students through building end-to-end data pipelines and analytical narratives on real-world datasets."
      },
      {
        icon: "layout",
        title: "Dashboard Critiques",
        description: "Assess student dashboard submissions. Give constructive critiques on visualization layout and metrics clarity."
      },
      {
        icon: "lightbulb",
        title: "Curriculum Evolution",
        description: "Partner with content architects to add new business case-studies, SQL quizzes, and data wrangling challenges."
      }
    ]
  },

  // Key Skills Section
  keySkills: {
    title: "Skills We Value",
    subtitle: "Technologies and methodologies you will teach or use in mentoring sessions",
    skills: [
      {
        name: "Advanced Excel",
        description: "Pivot charts, lookups, statistical functions, Power Query modeling.",
        icon: "excel"
      },
      {
        name: "SQL & Databases",
        description: "DML, complex subqueries, CTEs, window functions, query tuning.",
        icon: "database"
      },
      {
        name: "Power BI",
        description: "Data modeling, DAX queries, reports rendering, gateway configs.",
        icon: "chart"
      },
      {
        name: "Python (Pandas/NumPy)",
        description: "Data cleaning, exploratory data analysis, plotting with Seaborn.",
        icon: "eye"
      },
      {
        name: "Statistics & ML Basics",
        description: "Probability distributions, regression lines, A/B testing methods.",
        icon: "brain"
      },
      {
        name: "Data Visualization",
        description: "Applying narrative standards, selecting charts, and user layout principles.",
        icon: "trending"
      }
    ]
  },

  // Eligibility / Who Can Apply Section
  eligibility: {
    title: "Who Can Apply?",
    subtitle: "We welcome applications from experienced analysts and passionate teachers",
    items: [
      {
        title: "Data Analytics Professionals",
        description: "Data Analysts, Business Intelligence Engineers, or Data Architects with practical, industry experience working with metrics."
      },
      {
        title: "Experienced Trainers & Academics",
        description: "Professionals who have previously taught at bootcamps, universities, or hosted internal corporate learning workshops."
      },
      {
        title: "Passionate Educators",
        description: "Even if you have not taught formally, if you enjoy writing tutorials, hosting study sessions, and coaching juniors, we encourage you to apply."
      },
      {
        title: "Strong Communicators",
        description: "Candidates who can articulate complex technical queries in simple language and give constructive feedback to learners."
      }
    ]
  },

  // Why Join Us Section
  whyJoin: {
    title: "Why Join Grambytes Nexus?",
    subtitle: "Impact the next generation of data specialists while collaborating with top mentors",
    cards: [
      {
        title: "Real-world Impact",
        description: "Help students successfully pivot into corporate roles. Your guidance changes career trajectories."
      },
      {
        title: "Flexible Engagements",
        description: "Choose between Part-Time and Full-Time arrangements. Balance your mentoring sessions with your primary job."
      },
      {
        title: "Continuous Learning",
        description: "Access advanced bootcamps, SQL challenges, and networking forums to stay sharp in your own analytics skills."
      },
      {
        title: "Collaborative Team",
        description: "Connect with other industry leaders and mentors. Exchange training frameworks and teaching methods."
      },
      {
        title: "Professional Growth",
        description: "Build your personal brand as a thought-leader and educator in the modern Data Analytics space."
      },
      {
        title: "Competitive Compensation",
        description: "Receive attractive hourly or monthly payouts based on training hours, cohort ratings, and curriculum support."
      }
    ]
  },

  // Custom Form Details (to assist dynamic checks if needed)
  formMetadata: {
    title: "Mentor / Trainer Application Form",
    subtitle: "Grambytes Nexus — Data Analytics Campaign"
  }
};

// Expose CONFIG to global window
window.CONFIG = CONFIG;
