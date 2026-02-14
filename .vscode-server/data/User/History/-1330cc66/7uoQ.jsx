const subirImagen = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("imagen", file); // debe coincidir con upload.single("imagen")

  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/proyectos/${proyecto._id}/imagenes`, {
    method: "POST",
    body: formData,
    headers: token ? { "x-token": token } : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.error || `Error ${res.status}`);
    return;
  }

  const data = await res.json();
  // Opcional: actualiza localmente con la URL
  // setProyecto(prev => ({ ...prev, imagenes: [...(prev.imagenes || []), data.url] }));
  onUpdated?.();
};
