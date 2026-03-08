// ============================================================
// AGREGAR ESTO AL FINAL DE TU Code.gs
// Permite que el frontend PWA (GitHub Pages) llame al backend
// mediante fetch() en lugar de google.script.run
// ============================================================

function doPost(e) {
  // Headers CORS para permitir llamadas desde GitHub Pages
  var headers = {
    'Access-Control-Allow-Origin': 'https://psicmiguelglez-bit.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    var body    = JSON.parse(e.postData.contents);
    var action  = body.action;
    var args    = body.args || [];

    // Mapa de funciones permitidas (whitelist de seguridad)
    var allowed = {
      'doLogin':                    doLogin,
      'doLogout':                   doLogout,
      'getDashboardMetrics':        getDashboardMetrics,
      'searchPatients':             searchPatients,
      'addPatient':                 addPatient,
      'getPatientBundle':           getPatientBundle,
      'updatePatientBundle':        updatePatientBundle,
      'addAppointment':             addAppointment,
      'listAppointmentsByDate':     listAppointmentsByDate,
      'listAppointmentsByRange':    listAppointmentsByRange,
      'cambiarEstatusCita':         cambiarEstatusCita,
      'getConfirmacionesPendientes':getConfirmacionesPendientes,
      'actualizarConfirmacion':     actualizarConfirmacion,
      'getEspaciosLibres':          getEspaciosLibres,
      'getEspaciosLibresCompleto':  getEspaciosLibresCompleto,
      'listFinanzas':               listFinanzas,
      'listFinanzasByRange':        listFinanzasByRange,
      'getPsicologos':              getPsicologos,
      'getHistorialClinico':        getHistorialClinico,
      'saveHistorialClinico':       saveHistorialClinico,
      'addSessionNote':             addSessionNote,
      'getPlantillasNotas':         getPlantillasNotas,
      'saveChecklistPaciente':      saveChecklistPaciente,
      'guardarEvaluacionRiesgo':    guardarEvaluacionRiesgo,
      'verificarContactoEmergencia':verificarContactoEmergencia,
      'obtenerCarpetaPaciente':     obtenerCarpetaPaciente,
    };

    if (!allowed[action]) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Acción no permitida: ' + action }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Llamar la función con los argumentos
    var result = allowed[action].apply(null, args);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Manejar solicitudes OPTIONS (preflight CORS)
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
