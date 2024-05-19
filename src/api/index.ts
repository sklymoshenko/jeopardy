const BASE_URL = `http://192.168.1.70:3000/api/`

export const apiGet = async <T>(url: string): Promise<{ data?: T; error?: string }> => {
  try {
    const request = await fetch(`${BASE_URL}${url}/`)
    const response = await request.json()

    if (response.data) {
      return { data: response.data, error: undefined }
    }

    return { data: undefined, error: response.error }
  } catch (err: unknown) {
    console.error(err)
    return { error: (err as Error).message, data: undefined }
  }
}

export const apiPost = async <T>(url: string, body: Record<string, any>): Promise<{ data?: T; error?: string }> => {
  try {
    const request = await fetch(`${BASE_URL}${url}/`, { method: "POST", body: JSON.stringify(body) })
    const response = await request.json()

    if (response.data) {
      return { data: response.data, error: undefined }
    }

    return { data: undefined, error: response.error }
  } catch (err: unknown) {
    console.error(err)
    return { error: (err as Error).message, data: undefined }
  }
}
