import { gql } from '@apollo/client';

// QUERIES
export const GET_PROJECTS = gql`
  query GetProjects($category: String) {
    projects(category: $category) {
      id
      title
      description
      category
      techStack
      tools
      github
      liveDemo
      image
      featured
      order
      achievements
      challenges
      duration
      role
      showInAllPortfolios
      createdAt
    }
  }
`;

export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects($category: String) {
    featuredProjects(category: $category) {
      id
      title
      description
      category
      techStack
      tools
      github
      liveDemo
      image
      featured
      showInAllPortfolios
    }
  }
`;

export const GET_TESTIMONIALS = gql`
  query GetTestimonials($category: String) {
    testimonials(category: $category) {
      id
      name
      role
      company
      message
      avatar
      rating
      category
      createdAt
    }
  }
`;

export const GET_FEATURED_TESTIMONIALS = gql`
  query GetFeaturedTestimonials {
    featuredTestimonials {
      id
      name
      role
      company
      message
      avatar
      rating
      category
    }
  }
`;

export const GET_BLOGS = gql`
  query GetBlogs($category: String, $published: Boolean) {
    blogs(category: $category, published: $published) {
      id
      title
      slug
      excerpt
      category
      tags
      coverImage
      author
      published
      featured
      views
      readTime
      showInAllPortfolios
      createdAt
    }
  }
`;

export const GET_BLOG = gql`
  query GetBlog($id: ID, $slug: String) {
    blog(id: $id, slug: $slug) {
      id
      title
      slug
      excerpt
      content
      category
      tags
      coverImage
      author
      published
      featured
      views
      readTime
      createdAt
      updatedAt
    }
  }
`;

export const GET_STATS = gql`
  query GetStats {
    stats {
      totalProjects
      totalTestimonials
      totalBlogs
      totalContacts
      totalNewsletters
      projectsByCategory {
        developer
        datascience
        ux
        general
      }
      testimonialsByCategory {
        developer
        datascience
        ux
        general
      }
    }
  }
`;

// MUTATIONS
export const CREATE_CONTACT = gql`
  mutation CreateContact($input: ContactInput!) {
    createContact(input: $input) {
      id
      name
      email
      subject
      message
      category
      createdAt
    }
  }
`;

export const SUBSCRIBE_NEWSLETTER = gql`
  mutation SubscribeNewsletter($input: NewsletterInput!) {
    subscribeNewsletter(input: $input) {
      id
      email
      name
      interests
      subscribed
    }
  }
`;

export const CREATE_TESTIMONIAL = gql`
  mutation CreateTestimonial($input: TestimonialInput!) {
    createTestimonial(input: $input) {
      id
      name
      role
      company
      message
      rating
      category
    }
  }
`;

export const INCREMENT_BLOG_VIEWS = gql`
  mutation IncrementBlogViews($id: ID!) {
    incrementBlogViews(id: $id) {
      id
      views
    }
  }
`;

// ADMIN MUTATIONS
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
      description
      category
      techStack
      github
      liveDemo
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile($portfolioType: String!) {
    profile(portfolioType: $portfolioType) {
      portfolioType
      name
      title
      tagline
      bio
      coverImage
      aboutHeading
      aboutDescription
      aboutHighlights
      stats {
        projectsCompleted
        yearsExperience
      }
      resumeUrl
      isVisible
      showStats
      showAbout
      showProjects
      showBlogs
      showContact
      metaDescription
      metaKeywords
    }
  }
`;

export const GET_ALL_PROFILES = gql`
  query GetAllProfiles {
    profiles {
      portfolioType
      name
      title
      profileImage
    }
  }
`;

export const GET_SKILLS = gql`
  query GetSkills($portfolioType: String) {
    skills(portfolioType: $portfolioType) {
      id
      name
      category
      level
      icon
      portfolioType
      yearsOfExperience
      isVisible
      order
    }
  }
`;

export const GET_EXPERIENCES = gql`
  query GetExperiences($portfolioType: String) {
    experiences(portfolioType: $portfolioType) {
      id
      company
      position
      employmentType
      location
      startDate
      endDate
      current
      description
      responsibilities
      achievements
      technologies
      companyLogo
      companyWebsite
      portfolioType
      isVisible
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      description
      category
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      message
    }
  }
`;

// EDUCATION QUERIES
export const GET_EDUCATIONS = gql`
  query GetEducations($portfolioType: String) {
    educations(portfolioType: $portfolioType) {
      id
      institution
      degree
      field
      grade
      startYear
      endYear
      current
      description
      achievements
      coursework
      institutionLogo
      institutionWebsite
      portfolioType
      order
      isVisible
    }
  }
`;

// SETTINGS QUERIES
export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings {
    siteSettings {
      id
      siteName
      siteTitle
      siteDescription
      siteKeywords
      availableForWork
      availabilityMessage
      emailConfig {
        enabled
        smtpHost
        smtpPort
        smtpUser
        senderEmail
        receiverEmail
        autoReply
        autoReplyMessage
      }
      theme {
        primaryColor
        secondaryColor
        darkMode
        font
      }
      features {
        showBlog
        showProjects
        showTestimonials
        showNewsletter
        showContact
        enableComments
        enableAnalytics
      }
      analytics {
        googleAnalyticsId
        facebookPixelId
      }
      seo {
        ogImage
        twitterHandle
        favicon
      }
      maintenanceMode
      maintenanceMessage
    }
  }
`;

export const GET_SOCIAL_LINKS = gql`
  query GetSocialLinks {
    socialLinks {
      github
      linkedin
      leetcode
      hackerrank
      medium
      devto
      stackoverflow
      kaggle
      behance
      dribbble
      email
      phone
      location
      personalWebsite
      customLinks {
        name
        url
        icon
      }
    }
  }
`;
