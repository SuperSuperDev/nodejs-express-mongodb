import dotenv from 'dotenv'
dotenv.config()
export const env = process.env.NODE_ENV || 'development'

export const dbURI = process.env.DB_URI || 'mongodb://localhost:27018/mevn-db'

export const port = process.env.SERVER_PORT || 4000

export const secret =
  process.env.SECRET || 'myrandomsecretfishpengiraffeclaxonrenewedexon'
