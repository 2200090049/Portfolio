import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    # Projects
    projects(category: String): [Project]
    allProjects: [Project]
    project(id: ID!): Project
    featuredProjects(category: String): [Project]
    
    # Testimonials
    testimonials(category: String): [Testimonial]
    testimonial(id: ID!): Testimonial
    featuredTestimonials: [Testimonial]
    
    # Blog
    blogs(category: String, published: Boolean): [Blog]
    blog(id: ID, slug: String): Blog
    featuredBlogs(category: String): [Blog]
    
    # Contacts (Admin only)
    contacts(status: String): [Contact]
    contact(id: ID!): Contact
    
    # Newsletter (Admin only)
    newsletters: [Newsletter]
    
    # Stats
    stats: Stats
    
    # Admin Queries (Protected)
    verifyAdmin: Admin
    getAdminProfile: Admin
    getAllAdmins: [Admin]
    getRemainingSecureKeys: Int
    getSecureKeys: [SecureKey]
    
    # GOD MODE Queries (Admin only)
    # Profiles
    profiles: [Profile]
    profile(portfolioType: String!): Profile
    
    # Skills
    skills(category: String, portfolioType: String): [Skill]
    skill(id: ID!): Skill
    skillStats: SkillStats
    
    # Experience
    experiences(portfolioType: String): [Experience]
    experience(id: ID!): Experience
    experienceStats: ExperienceStats
    
    # Education
    educations(portfolioType: String): [Education]
    education(id: ID!): Education
    educationStats: EducationStats
    
    # Social Links & Site Settings
    socialLinks: SocialLinks
    siteSettings: SiteSettings
  }

  type Mutation {
    # Admin Authentication
    registerAdmin(input: RegisterAdminInput!): AuthResponse
    loginAdmin(input: LoginAdminInput!): AuthResponse
    logoutAdmin: DeleteResponse
    updateAdminProfile(input: UpdateAdminInput!): Admin
    changeAdminPassword(currentPassword: String!, newPassword: String!): DeleteResponse
    deleteAdmin(id: ID!): DeleteResponse
    
    # Projects (Admin only)
    createProject(input: ProjectInput!): Project
    updateProject(id: ID!, input: ProjectInput!): Project
    deleteProject(id: ID!): DeleteResponse
    
    # Testimonials
    createTestimonial(input: TestimonialInput!): Testimonial
    updateTestimonial(id: ID!, input: TestimonialInput!): Testimonial
    deleteTestimonial(id: ID!): DeleteResponse
    approveTestimonial(id: ID!): Testimonial
    
    # Blog (Admin only)
    createBlog(input: BlogInput!): Blog
    updateBlog(id: ID!, input: BlogInput!): Blog
    deleteBlog(id: ID!): DeleteResponse
    incrementBlogViews(id: ID!): Blog
    
    # Contact
    createContact(input: ContactInput!): Contact
    updateContactStatus(id: ID!, status: String!): Contact
    deleteContact(id: ID!): DeleteResponse
    
    # Newsletter
    subscribeNewsletter(input: NewsletterInput!): Newsletter
    unsubscribeNewsletter(email: String!): Newsletter
    
    # ============= GOD MODE MUTATIONS =============
    
    # Profile Management (CRUD for all 3 portfolios)
    createProfile(input: ProfileInput!): Profile
    updateProfile(portfolioType: String!, input: ProfileInput!): Profile
    deleteProfile(portfolioType: String!): DeleteResponse
    
    # Skills Management (CRUD)
    createSkill(input: SkillInput!): Skill
    updateSkill(id: ID!, input: SkillInput!): Skill
    deleteSkill(id: ID!): DeleteResponse
    reorderSkills(ids: [ID!]!): [Skill]
    
    # Experience Management (CRUD)
    createExperience(input: ExperienceInput!): Experience
    updateExperience(id: ID!, input: ExperienceInput!): Experience
    deleteExperience(id: ID!): DeleteResponse
    reorderExperiences(ids: [ID!]!): [Experience]
    
    # Education Management (CRUD)
    createEducation(input: EducationInput!): Education
    updateEducation(id: ID!, input: EducationInput!): Education
    deleteEducation(id: ID!): DeleteResponse
    reorderEducations(ids: [ID!]!): [Education]
    
    # Social Links Management (Update only - singleton)
    updateSocialLinks(input: SocialLinksInput!): SocialLinks
    
    # Site Settings Management (Update only - singleton)
    updateSiteSettings(input: SiteSettingsInput!): SiteSettings
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    category: String!
    techStack: [String]
    tools: [String]
    github: String
    liveDemo: String
    image: String
    featured: Boolean
    order: Int
    achievements: [String]
    challenges: String
    duration: String
    role: String
    showInAllPortfolios: Boolean
    createdAt: String
    updatedAt: String
  }

  type Testimonial {
    id: ID!
    name: String!
    role: String!
    company: String
    message: String!
    avatar: String
    rating: Int
    category: String
    approved: Boolean
    featured: Boolean
    createdAt: String
    updatedAt: String
  }

  type Blog {
    id: ID!
    title: String!
    slug: String!
    excerpt: String!
    content: String!
    category: String!
    tags: [String]
    coverImage: String
    author: String
    published: Boolean
    featured: Boolean
    views: Int
    readTime: String
    showInAllPortfolios: Boolean
    createdAt: String
    updatedAt: String
  }

  type Contact {
    id: ID!
    name: String!
    email: String!
    subject: String!
    message: String!
    category: String
    status: String
    ipAddress: String
    userAgent: String
    createdAt: String
    updatedAt: String
  }

  type Newsletter {
    id: ID!
    email: String!
    name: String
    interests: [String]
    subscribed: Boolean
    subscribedAt: String
    unsubscribedAt: String
  }

  type Stats {
    totalProjects: Int
    totalTestimonials: Int
    totalBlogs: Int
    totalContacts: Int
    totalNewsletters: Int
    projectsByCategory: CategoryStats
    testimonialsByCategory: CategoryStats
  }

  type CategoryStats {
    developer: Int
    datascience: Int
    ux: Int
    general: Int
  }

  type SkillStats {
    totalSkills: Int
    skillsByCategory: SkillCategoryStats
  }

  type SkillCategoryStats {
    frontend: Int
    backend: Int
    database: Int
    tools: Int
    datascience: Int
    ml: Int
    design: Int
    other: Int
  }

  type ExperienceStats {
    totalExperiences: Int
    currentJobs: Int
    totalYears: Int
  }

  type EducationStats {
    totalEducations: Int
    degrees: Int
    certifications: Int
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  input ProjectInput {
    title: String!
    description: String!
    category: String!
    techStack: [String]
    tools: [String]
    github: String
    liveDemo: String
    image: String
    featured: Boolean
    order: Int
    achievements: [String]
    challenges: String
    duration: String
    role: String
    showInAllPortfolios: Boolean
  }

  input TestimonialInput {
    name: String!
    role: String!
    company: String
    message: String!
    avatar: String
    rating: Int
    category: String
    approved: Boolean
    featured: Boolean
  }

  input BlogInput {
    title: String!
    slug: String!
    excerpt: String!
    content: String!
    category: String!
    tags: [String]
    coverImage: String
    author: String
    published: Boolean
    featured: Boolean
    readTime: String
    showInAllPortfolios: Boolean
  }

  input ContactInput {
    name: String!
    email: String!
    subject: String!
    message: String!
    category: String
  }

  input NewsletterInput {
    email: String!
    name: String
    interests: [String]
  }

  # Admin Types
  type Admin {
    id: ID!
    username: String!
    email: String!
    role: String!
    isActive: Boolean!
    lastLogin: String
    createdAt: String
    updatedAt: String
  }

  type SecureKey {
    id: ID!
    key: String!
    isUsed: Boolean!
    usedBy: Admin
    usedAt: String
    description: String
    createdAt: String
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    admin: Admin
  }

  input RegisterAdminInput {
    username: String!
    email: String!
    password: String!
    secureKey: String!
  }

  input LoginAdminInput {
    username: String!
    password: String!
  }

  input UpdateAdminInput {
    username: String
    email: String
  }
  
  # ============= GOD MODE TYPES =============
  
  # Profile Type
  type Profile {
    id: ID!
    portfolioType: String!
    name: String!
    title: String!
    tagline: String
    bio: String
    coverImage: String
    aboutHeading: String
    aboutDescription: String
    aboutHighlights: [String]
    stats: ProfileStats
    resumeUrl: String
    isVisible: Boolean
    showStats: Boolean
    showAbout: Boolean
    showProjects: Boolean
    showBlogs: Boolean
    showContact: Boolean
    metaDescription: String
    metaKeywords: [String]
    createdAt: String
    updatedAt: String
  }
  
  type ProfileStats {
    projectsCompleted: Int
    yearsExperience: Int
  }
  
  input ProfileInput {
    name: String
    title: String
    tagline: String
    bio: String
    coverImage: String
    aboutHeading: String
    aboutDescription: String
    aboutHighlights: [String]
    stats: ProfileStatsInput
    resumeUrl: String
    isVisible: Boolean
    showStats: Boolean
    showAbout: Boolean
    showProjects: Boolean
    showBlogs: Boolean
    showContact: Boolean
    metaDescription: String
    metaKeywords: [String]
  }
  
  input ProfileStatsInput {
    projectsCompleted: Int
    yearsExperience: Int
  }
  
  # Skill Type
  type Skill {
    id: ID!
    name: String!
    category: String!
    level: Int
    icon: String
    portfolioType: String
    order: Int
    isVisible: Boolean
    yearsOfExperience: Int
    createdAt: String
    updatedAt: String
  }
  
  input SkillInput {
    name: String!
    category: String!
    level: Int
    icon: String
    portfolioType: String
    order: Int
    isVisible: Boolean
    yearsOfExperience: Int
  }
  
  # Experience Type
  type Experience {
    id: ID!
    company: String!
    position: String!
    employmentType: String
    location: String
    startDate: String
    endDate: String
    current: Boolean
    description: String
    responsibilities: [String]
    achievements: [String]
    technologies: [String]
    companyLogo: String
    companyWebsite: String
    portfolioType: String
    order: Int
    isVisible: Boolean
    createdAt: String
    updatedAt: String
  }
  
  input ExperienceInput {
    company: String!
    position: String!
    employmentType: String
    location: String
    startDate: String
    endDate: String
    current: Boolean
    description: String
    responsibilities: [String]
    achievements: [String]
    technologies: [String]
    companyLogo: String
    companyWebsite: String
    portfolioType: String
    order: Int
    isVisible: Boolean
  }
  
  # Education Type
  type Education {
    id: ID!
    institution: String!
    degree: String!
    field: String
    grade: String
    startYear: Int
    endYear: Int
    current: Boolean
    description: String
    achievements: [String]
    coursework: [String]
    institutionLogo: String
    institutionWebsite: String
    portfolioType: String
    order: Int
    isVisible: Boolean
    createdAt: String
    updatedAt: String
  }
  
  input EducationInput {
    institution: String!
    degree: String!
    field: String
    grade: String
    startYear: Int
    endYear: Int
    current: Boolean
    description: String
    achievements: [String]
    coursework: [String]
    institutionLogo: String
    institutionWebsite: String
    portfolioType: String
    order: Int
    isVisible: Boolean
  }
  
  # Social Links Type
  type SocialLinks {
    id: ID!
    github: String
    linkedin: String
    leetcode: String
    hackerrank: String
    medium: String
    devto: String
    stackoverflow: String
    kaggle: String
    behance: String
    dribbble: String
    email: String
    phone: String
    location: String
    personalWebsite: String
    customLinks: [CustomLink]
    createdAt: String
    updatedAt: String
  }
  
  type CustomLink {
    name: String
    url: String
    icon: String
  }
  
  input SocialLinksInput {
    github: String
    linkedin: String
    leetcode: String
    hackerrank: String
    medium: String
    devto: String
    stackoverflow: String
    kaggle: String
    behance: String
    dribbble: String
    email: String
    phone: String
    location: String
    personalWebsite: String
    customLinks: [CustomLinkInput]
  }
  
  input CustomLinkInput {
    name: String
    url: String
    icon: String
  }
  
  # Site Settings Type
  type SiteSettings {
    id: ID!
    siteName: String
    siteTitle: String
    siteDescription: String
    siteKeywords: [String]
    availableForWork: Boolean
    availabilityMessage: String
    emailConfig: EmailConfig
    theme: Theme
    features: Features
    analytics: Analytics
    seo: SEO
    maintenanceMode: Boolean
    maintenanceMessage: String
    createdAt: String
    updatedAt: String
  }
  
  type EmailConfig {
    enabled: Boolean
    smtpHost: String
    smtpPort: Int
    smtpUser: String
    smtpPassword: String
    senderEmail: String
    receiverEmail: String
    autoReply: Boolean
    autoReplyMessage: String
  }
  
  type Theme {
    primaryColor: String
    secondaryColor: String
    darkMode: Boolean
    font: String
  }
  
  type Features {
    showBlog: Boolean
    showProjects: Boolean
    showTestimonials: Boolean
    showNewsletter: Boolean
    showContact: Boolean
    enableComments: Boolean
    enableAnalytics: Boolean
  }
  
  type Analytics {
    googleAnalyticsId: String
    facebookPixelId: String
  }
  
  type SEO {
    ogImage: String
    twitterHandle: String
    favicon: String
  }
  
  input SiteSettingsInput {
    siteName: String
    siteTitle: String
    siteDescription: String
    siteKeywords: [String]
    availableForWork: Boolean
    availabilityMessage: String
    emailConfig: EmailConfigInput
    theme: ThemeInput
    features: FeaturesInput
    analytics: AnalyticsInput
    seo: SEOInput
    maintenanceMode: Boolean
    maintenanceMessage: String
  }
  
  input EmailConfigInput {
    enabled: Boolean
    smtpHost: String
    smtpPort: Int
    smtpUser: String
    smtpPassword: String
    senderEmail: String
    receiverEmail: String
    autoReply: Boolean
    autoReplyMessage: String
  }
  
  input ThemeInput {
    primaryColor: String
    secondaryColor: String
    darkMode: Boolean
    font: String
  }
  
  input FeaturesInput {
    showBlog: Boolean
    showProjects: Boolean
    showTestimonials: Boolean
    showNewsletter: Boolean
    showContact: Boolean
    enableComments: Boolean
    enableAnalytics: Boolean
  }
  
  input AnalyticsInput {
    googleAnalyticsId: String
    facebookPixelId: String
  }
  
  input SEOInput {
    ogImage: String
    twitterHandle: String
    favicon: String
  }
`;
