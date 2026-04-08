<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(403);
  exit;
}

// Anti-spam
if (!empty($_POST["empresa"])) {
  exit;
}

$nombre = htmlspecialchars($_POST["nombre"]);
$telefono = htmlspecialchars($_POST["telefono"]);
$correo = htmlspecialchars($_POST["correo"]);
$mensaje = htmlspecialchars($_POST["mensaje"]);

$to = "tu_correo@ejemplo.com"; // Cambia esto por tu correo
$subject = "Nuevo mensaje de contacto";
$body = "Nombre: $nombre\nTeléfono: $telefono\nCorreo: $correo\nMensaje: $mensaje";
$headers = "From: $correo";

if (mail($to, $subject, $body, $headers)) {
    echo "<p>Mensaje enviado exitosamente.</p>";
} else {
    echo "<p>Error al enviar el mensaje. Inténtalo de nuevo.</p>";
}

header("Location: index.html");
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contacto - Estrategica Legal</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Contacto</h1>
    </header>

    <main>
        <form action="contact.php" method="POST">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>

            <label for="telefono">Teléfono:</label>
            <input type="tel" id="telefono" name="telefono" required>

            <label for="correo">Correo:</label>
            <input type="email" id="correo" name="correo" required>

            <label for="mensaje">Mensaje:</label>
            <textarea id="mensaje" name="mensaje" required></textarea>

            <button type="submit">Enviar</button>
        </form>
    </main>

    <footer>
        <p>&copy; 2026 Estrategica Legal. Todos los derechos reservados.</p>
    </footer>
</body>
</html>
