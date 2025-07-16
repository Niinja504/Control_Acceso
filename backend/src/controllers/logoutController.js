const logoutController = {};

// I N S E R T
logoutController.logout = async (req, res) => {
  try {
    res.clearCookie("authToken");
    return res.status(200).json({ message: "Sesion cerrada correctamente" });

  } catch (error) {
    return res.status(500).json({ error: "Error al cerrar sesion" });
  } 
};

export default logoutController;