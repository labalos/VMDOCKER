const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    setMessage("");
  
    try {
      const response = await fetch("http://localhost:3000/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          servicio,
          mensaje
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error al enviar la solicitud");
      }
  
      // ÉXITO
      setMessage("Solicitud enviada correctamente");
      setNombre("");
      setEmail("");
      setTelefono("");
      setServicio("");
      setMensaje("");
  
    } catch (error) {
      // ERROR
      setMessage("Hubo un error al enviar la solicitud");
    }
  
    setLoading(false);
  };