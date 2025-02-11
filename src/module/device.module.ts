const userAgentExp =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export const detectUserAgent = (userAgent: string): boolean => {
  return userAgentExp.test(userAgent)
}
