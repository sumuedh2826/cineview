import {
  VALID_PASSWORD,
  VALID_USERNAME,
} from '../../core/constants/Auth.constants'

export function verifyCredentials(
  username: string,
  password: string,
): boolean {
  return username === VALID_USERNAME && password === VALID_PASSWORD
}