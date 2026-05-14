export function showErrorToast(toast, title, error) {
  const detail = error?.message || error?.details || error?.code || String(error);
  toast({
    title,
    description: detail,
    variant: "destructive",
  });
}
