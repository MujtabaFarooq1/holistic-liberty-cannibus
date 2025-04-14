import { setItem, getItem, removeItem } from "./../utils/storage"

const AGE_KEY = "liberty_cannibus_age"

export function getAgeStatus() {
  let { data, error } = getItem(AGE_KEY)

  if (error) {
    return { error: true }
  }

  return { data, error: false }
}

export function setAgeStatus(status) {
  let { error } = setItem(AGE_KEY, status)

  return { error }
}

export function removeAgeStatus() {
  removeItem(AGE_KEY)
  return true
}