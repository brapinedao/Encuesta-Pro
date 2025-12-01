export interface ILoginData {
  email: string
  password: string
  remember: boolean
}

export interface IRegisterData {
  email: string
  password: string
  companyId: number
}

export interface ILoginResponse {
  name: string
  email: string
  photo: string
  rol?: string
}

export interface IPermissions {
  title: string
  childrens: IChildrenPermissions[]
}

export interface IChildrenPermissions {
  title: string
}

export interface IUsersResponse {
  id: number
  username: string
  password: string
  name: string
  image: string
  rol: string
}

// Answer interfaces
export interface ICreateAnswerDto {
  surveyId: number
  details: ICreateAnswerDetailDto[]
}

export interface ICreateAnswerDetailDto {
  questionId: number
  optionId?: number
  textValue?: string
}

export interface IAnswerDto {
  id: number
  surveyId: number
  createdAt: string
  details: IAnswerDetailDto[]
}

export interface IAnswerDetailDto {
  id: number
  questionId: number
  optionId?: number
  textValue?: string
}

export interface ISurveyResponse {
  id: number
  title: string
  description: string
  responses: number
  date: string
  status: string
}

export interface IQuestion {
  id: number
  text: string
  fieldType: 'text' | 'textarea' | 'radio' | 'checkbox'
  options: IQuestionOption[]
  required?: boolean
}

export interface IQuestionOption {
  id: number
  text: string
}

// JWT Authentication Interfaces
export interface IAuthTokens {
  token: string
  email: string
  userId: string
}

export interface ITokenPayload {
  sub: string // email
  uid: string // userId
  companyId: string
  jti: string
  exp: number
  iss: string
  aud: string
}

// Company Interfaces
export interface ICompany {
  id: number
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface ICreateCompanyDto {
  name: string
  description?: string
}

export interface IUpdateCompanyDto {
  name?: string
  description?: string
}

// Survey Interfaces (extended)
export interface ISurvey {
  id: number
  title: string
  description: string
  companyId: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  questions?: IQuestion[]
  responsesCount: number
}

export interface ICreateSurveyDto {
  title: string
  description: string
  companyId: number
  questions?: IQuestion[]
}

export interface IUpdateSurveyDto {
  title?: string
  description?: string
  isActive?: boolean
  questions?: IQuestion[]
}

// Answer Interfaces
export interface IAnswer {
  id: number
  surveyId: number
  questionId: number
  userId?: string
  answerText?: string
  selectedOptions?: string[]
  createdAt?: string
}

export interface ISubmitAnswerDto {
  surveyId: number
  answers: {
    questionId: number
    answerText?: string
    selectedOptions?: string[]
  }[]
  userId?: string
}

export interface ISurveyResponseData {
  id: number
  surveyId: number
  userId?: string
  answers: IAnswer[]
  submittedAt: string
}

// Statistics Interfaces
export interface IQuestionStatistics {
  questionId: number
  questionTitle: string
  questionType: string
  totalResponses: number
  responses: {
    option: string
    count: number
    percentage: number
  }[]
}

export interface ISurveyStatistics {
  surveyId: number
  surveyTitle: string
  totalResponses: number
  completionRate: number
  averageTimeToComplete?: number
  questionStatistics: IQuestionStatistics[]
  createdAt: string
  lastResponseAt?: string
}

export interface ICompanyStatistics {
  companyId: number
  companyName: string
  totalSurveys: number
  activeSurveys: number
  totalResponses: number
  averageResponsesPerSurvey: number
  mostPopularSurvey?: {
    id: number
    title: string
    responses: number
  }
}

export interface IGeneralStatistics {
  totalCompanies: number
  totalSurveys: number
  totalResponses: number
  totalUsers: number
  activeSurveys: number
  responsesByMonth: {
    month: string
    count: number
  }[]
}
