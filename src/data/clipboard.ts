export async function copyToClipboard(content: string) {
  return await navigator.clipboard.writeText(content);
}

export async function pasteFromClipboard(): Promise<string> {
  return await navigator.clipboard.readText();
}

const onClipboardChange = async (e: Event) => {
  // const { checkClipboardContent } = store.dispatch.documentModel;
  const text = await navigator.clipboard.readText();
  console.log("Updated clipboard contents: ", text, e.type);
  // checkClipboardContent(text);
};

export function listenToClipboard() {
  navigator.clipboard.addEventListener("clipboardchange", onClipboardChange, {
    passive: true,
  });
}

export function stopListeningToClipboard() {
  navigator.clipboard.removeEventListener("clipboardchange", onClipboardChange);
}
