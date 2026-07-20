// ============================================================
// YAZAKI - Worker de monitoreo de avance (Constructora E4 SA)
// GET  /api/tasks     -> lista completa de tareas con estado actual
// GET  /api/summary   -> avance ponderado global, por area y por proceso
// PATCH /api/tasks/:id -> actualiza % Real de una tarea (app de campo)
// ============================================================

const SCHEDULE = [{"id":"t001","area":"PRELIMINARES","proceso":"PRELIMINARES","actividad":null,"nombre":"PRELIMINARES","pctPlan":1,"pctRealBase":1,"inicio":"2026-05-18","fin":"2026-06-10","dur":23,"resumen":true},{"id":"t002","area":"PRELIMINARES","proceso":"PRELIMINARES","actividad":null,"nombre":"Construcción de bodega provisional","pctPlan":1,"pctRealBase":1,"inicio":"2026-05-18","fin":"2026-06-04","dur":17,"resumen":false},{"id":"t003","area":"PRELIMINARES","proceso":"PRELIMINARES","actividad":null,"nombre":"Instalaciones provisionales eléctricas","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-04","fin":"2026-06-10","dur":6,"resumen":false},{"id":"t004","area":"PRELIMINARES","proceso":"PRELIMINARES","actividad":null,"nombre":"Instalaciones provisionales de agua","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-04","fin":"2026-06-10","dur":6,"resumen":false},{"id":"t005","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Prioridad 1 (eje 1 a 2)","pctPlan":0.54,"pctRealBase":0.49,"inicio":"2026-06-10","fin":"2026-08-04","dur":55,"resumen":true},{"id":"t006","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Recepcion de Plataforma","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-19","fin":"2026-06-19","dur":1,"resumen":false},{"id":"t007","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Trazo y puenteado","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-20","fin":"2026-06-23","dur":3,"resumen":false},{"id":"t008","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Excavación","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-23","fin":"2026-07-02","dur":9,"resumen":false},{"id":"t009","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Armado de refuerzo (zapata + pedestal)","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-10","fin":"2026-06-23","dur":13,"resumen":false},{"id":"t010","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Centrado y preparación (Pastilla de limpieza y colocación de refuerzo)","pctPlan":1,"pctRealBase":0.57,"inicio":"2026-07-03","fin":"2026-07-13","dur":10,"resumen":false},{"id":"t011","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Fundición de Zapatas","pctPlan":0.47,"pctRealBase":0.41,"inicio":"2026-07-07","fin":"2026-07-16","dur":9,"resumen":false},{"id":"t012","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Encofrado de pedestales","pctPlan":0.09,"pctRealBase":0.17,"inicio":"2026-07-10","fin":"2026-07-20","dur":10,"resumen":false},{"id":"t013","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Fundición de Pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-13","fin":"2026-07-28","dur":15,"resumen":false},{"id":"t014","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 1","nombre":"Impermeabilización + relleno","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-22","fin":"2026-08-04","dur":13,"resumen":false},{"id":"t015","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Prioridad 2 (eje 3)","pctPlan":0.45,"pctRealBase":0.38,"inicio":"2026-06-23","fin":"2026-08-22","dur":60,"resumen":true},{"id":"t016","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Recepcion de Plataforma","pctPlan":1,"pctRealBase":1,"inicio":"2026-07-03","fin":"2026-07-03","dur":1,"resumen":false},{"id":"t017","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Trazo y puenteado","pctPlan":1,"pctRealBase":1,"inicio":"2026-07-03","fin":"2026-07-07","dur":4,"resumen":false},{"id":"t018","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Excavación","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-25","fin":"2026-07-11","dur":16,"resumen":false},{"id":"t019","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Armado de refuerzo (zapata + pedestal)","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-23","fin":"2026-07-06","dur":13,"resumen":false},{"id":"t020","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Centrado y preparación (Pastilla de limpieza y colocación de refuerzo)","pctPlan":0.75,"pctRealBase":0.28,"inicio":"2026-07-06","fin":"2026-07-15","dur":9,"resumen":false},{"id":"t021","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Fundición de Zapatas","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-16","fin":"2026-07-25","dur":9,"resumen":false},{"id":"t022","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Encofrado de pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-25","fin":"2026-08-06","dur":12,"resumen":false},{"id":"t023","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Fundición de Pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-06","fin":"2026-08-10","dur":4,"resumen":false},{"id":"t024","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 2","nombre":"Impermeabilización + relleno","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-11","fin":"2026-08-22","dur":11,"resumen":false},{"id":"t025","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Recepcion de Plataforma","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-16","fin":"2026-07-16","dur":1,"resumen":false},{"id":"t026","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Trazo y puenteado","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-17","fin":"2026-07-21","dur":4,"resumen":false},{"id":"t027","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Excavación","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-11","fin":"2026-07-25","dur":14,"resumen":false},{"id":"t028","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Armado de refuerzo (zapata + pedestal)","pctPlan":0.67,"pctRealBase":0.67,"inicio":"2026-07-17","fin":"2026-07-29","dur":12,"resumen":false},{"id":"t029","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Centrado y preparación (Pastilla de limpieza y colocación de refuerzo)","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-29","fin":"2026-08-07","dur":9,"resumen":false},{"id":"t030","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Fundición de Zapatas","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-07","fin":"2026-08-18","dur":11,"resumen":false},{"id":"t031","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Encofrado de pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-18","fin":"2026-08-29","dur":11,"resumen":false},{"id":"t032","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Fundición de Pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-29","fin":"2026-09-02","dur":4,"resumen":false},{"id":"t033","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 3","nombre":"Impermeabilización + relleno","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-02","fin":"2026-09-16","dur":14,"resumen":false},{"id":"t034","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Recepcion de Plataforma","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-10","fin":"2026-08-10","dur":1,"resumen":false},{"id":"t035","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Trazo y puenteado","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-11","fin":"2026-08-17","dur":6,"resumen":false},{"id":"t036","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Excavación","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-27","fin":"2026-08-10","dur":14,"resumen":false},{"id":"t037","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Armado de refuerzo (zapata + pedestal)","pctPlan":0.45,"pctRealBase":0.45,"inicio":"2026-07-29","fin":"2026-08-10","dur":12,"resumen":false},{"id":"t038","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Centrado y preparación (Pastilla de limpieza y colocación de refuerzo)","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-11","fin":"2026-08-20","dur":9,"resumen":false},{"id":"t039","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Fundición de Zapatas","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-20","fin":"2026-08-29","dur":9,"resumen":false},{"id":"t040","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Encofrado de pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-29","fin":"2026-09-18","dur":20,"resumen":false},{"id":"t041","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Fundición de Pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-18","fin":"2026-09-30","dur":12,"resumen":false},{"id":"t042","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 4","nombre":"Impermeabilización + relleno","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-23","fin":"2026-10-12","dur":19,"resumen":false},{"id":"t043","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Recepcion de Plataforma","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-10","fin":"2026-08-10","dur":1,"resumen":false},{"id":"t044","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Trazo y puenteado","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-17","fin":"2026-08-22","dur":5,"resumen":false},{"id":"t045","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Excavación","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-10","fin":"2026-09-03","dur":24,"resumen":false},{"id":"t046","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Armado de refuerzo (zapata + pedestal)","pctPlan":0.5,"pctRealBase":0.5,"inicio":"2026-08-11","fin":"2026-09-17","dur":37,"resumen":false},{"id":"t047","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Centrado y preparación (Pastilla de limpieza y colocación de refuerzo)","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-17","fin":"2026-10-12","dur":25,"resumen":false},{"id":"t048","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Fundición de Zapatas","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-12","fin":"2026-10-24","dur":12,"resumen":false},{"id":"t049","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Encofrado de pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-24","fin":"2026-11-18","dur":25,"resumen":false},{"id":"t050","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Fundición de Pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-11-18","fin":"2026-12-07","dur":19,"resumen":false},{"id":"t051","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 5","nombre":"Impermeabilización + relleno","pctPlan":0,"pctRealBase":0,"inicio":"2026-11-24","fin":"2026-12-12","dur":18,"resumen":false},{"id":"t052","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Recepcion de Plataforma","pctPlan":0.89,"pctRealBase":0.89,"inicio":"2026-07-28","fin":"2026-07-29","dur":1,"resumen":false},{"id":"t053","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Trazo y puenteado","pctPlan":1,"pctRealBase":1,"inicio":"2026-07-28","fin":"2026-07-28","dur":1,"resumen":false},{"id":"t054","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Excavación","pctPlan":1,"pctRealBase":1,"inicio":"2026-07-28","fin":"2026-08-08","dur":11,"resumen":false},{"id":"t055","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Armado de refuerzo (zapata + pedestal)","pctPlan":1,"pctRealBase":0.76,"inicio":"2026-08-08","fin":"2026-08-25","dur":17,"resumen":false},{"id":"t056","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Centrado y preparación (Pastilla de limpieza y colocación de refuerzo)","pctPlan":1,"pctRealBase":0.68,"inicio":"2026-08-25","fin":"2026-08-25","dur":1,"resumen":false},{"id":"t057","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Fundición de Zapatas","pctPlan":1,"pctRealBase":0.48,"inicio":"2026-08-25","fin":"2026-09-07","dur":13,"resumen":false},{"id":"t058","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Encofrado de pedestales","pctPlan":0.02,"pctRealBase":0,"inicio":"2026-09-10","fin":"2026-09-29","dur":19,"resumen":false},{"id":"t059","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Fundición de Pedestales","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-30","fin":"2026-10-12","dur":12,"resumen":false},{"id":"t060","area":"BODEGA PRINCIPAL","proceso":"CIMENTACION","actividad":"PRIORIDAD 6","nombre":"Impermeabilización + relleno","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-02","fin":"2026-10-21","dur":19,"resumen":false},{"id":"t061","area":"ESTRUCTURA METALICA BODEGA","proceso":"PRELIMINARES","actividad":null,"nombre":"Modelo y planos de taller","pctPlan":0.9,"pctRealBase":0.61,"inicio":"2026-05-19","fin":"2026-07-20","dur":62,"resumen":false},{"id":"t062","area":"ESTRUCTURA METALICA BODEGA","proceso":"PRELIMINARES","actividad":null,"nombre":"Importacion de materia prima","pctPlan":0.81,"pctRealBase":0.6,"inicio":"2026-05-29","fin":"2026-07-23","dur":55,"resumen":false},{"id":"t063","area":"ESTRUCTURA METALICA BODEGA","proceso":"PRELIMINARES","actividad":null,"nombre":"Materia prima local","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-08","fin":"2026-06-19","dur":11,"resumen":false},{"id":"t064","area":"ESTRUCTURA METALICA BODEGA","proceso":"FABRICACION Y TRASLADO","actividad":"PRIORIDAD 1","nombre":"Prioridad 1 (eje 1 a 2)","pctPlan":0.23,"pctRealBase":0.3,"inicio":"2026-06-27","fin":"2026-07-29","dur":32,"resumen":false},{"id":"t065","area":"ESTRUCTURA METALICA BODEGA","proceso":"FABRICACION Y TRASLADO","actividad":"PRIORIDAD 2","nombre":"Prioridad 2 (eje 2 a 3)","pctPlan":0.05,"pctRealBase":0.05,"inicio":"2026-07-29","fin":"2026-08-28","dur":30,"resumen":false},{"id":"t066","area":"ESTRUCTURA METALICA BODEGA","proceso":"FABRICACION Y TRASLADO","actividad":"PRIORIDAD 3","nombre":"Prioridad 3 (eje 3 a 4)","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-26","fin":"2026-10-29","dur":33,"resumen":false},{"id":"t067","area":"ESTRUCTURA METALICA BODEGA","proceso":"FABRICACION Y TRASLADO","actividad":"PRIORIDAD 4","nombre":"Prioridad 4 (eje 4 a 6)","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-29","fin":"2026-11-28","dur":30,"resumen":false},{"id":"t068","area":"ESTRUCTURA METALICA BODEGA","proceso":"FABRICACION Y TRASLADO","actividad":"PRIORIDAD 5","nombre":"Prioridad 5 (eje 6 a 7)","pctPlan":0,"pctRealBase":0,"inicio":"2026-11-28","fin":"2026-12-30","dur":32,"resumen":false},{"id":"t069","area":"ESTRUCTURA METALICA BODEGA","proceso":"FABRICACION Y TRASLADO","actividad":"PRIORIDAD 6","nombre":"Prioridad 6 (eje 7 a 9)","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-28","fin":"2026-09-26","dur":29,"resumen":false},{"id":"t070","area":"ESTRUCTURA METALICA BODEGA","proceso":"MONTAJE","actividad":"PRIORIDAD 1","nombre":"Prioridad 1 (eje 1 a 2)","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-17","fin":"2026-09-04","dur":49,"resumen":false},{"id":"t071","area":"ESTRUCTURA METALICA BODEGA","proceso":"MONTAJE","actividad":"PRIORIDAD 2","nombre":"Prioridad 2 (eje 2 a 3)","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-13","fin":"2026-10-01","dur":49,"resumen":false},{"id":"t072","area":"ESTRUCTURA METALICA BODEGA","proceso":"MONTAJE","actividad":"PRIORIDAD 3","nombre":"Prioridad 6 (eje 7 a 9)","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-11","fin":"2026-11-03","dur":53,"resumen":false},{"id":"t073","area":"ESTRUCTURA METALICA BODEGA","proceso":"MONTAJE","actividad":"PRIORIDAD 4","nombre":"Prioridad 3 (eje 3 a 4)","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-12","fin":"2026-12-01","dur":50,"resumen":false},{"id":"t074","area":"ESTRUCTURA METALICA BODEGA","proceso":"MONTAJE","actividad":"PRIORIDAD 5","nombre":"Prioridad 4 (eje 4 a 6)","pctPlan":0,"pctRealBase":0,"inicio":"2026-11-12","fin":"2026-12-30","dur":48,"resumen":false},{"id":"t075","area":"ESTRUCTURA METALICA BODEGA","proceso":"MONTAJE","actividad":"PRIORIDAD 6","nombre":"Prioridad 5 (eje 6 a 7)","pctPlan":0,"pctRealBase":0,"inicio":"2026-12-17","fin":"2027-02-11","dur":56,"resumen":false},{"id":"t076","area":"BODEGA PRINCIPAL","proceso":"MUROS DE CERRAMIENTO","actividad":"            Muro eje 1","nombre":"Muro eje 1","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-16","fin":"2026-08-26","dur":41,"resumen":false},{"id":"t077","area":"BODEGA PRINCIPAL","proceso":"MUROS DE CERRAMIENTO","actividad":"            Muro eje 8-9","nombre":"Muro eje 8-9","pctPlan":0,"pctRealBase":0.1,"inicio":"2026-08-03","fin":"2026-09-12","dur":40,"resumen":false},{"id":"t078","area":"BODEGA PRINCIPAL","proceso":"MUROS DE CERRAMIENTO","actividad":"            Muro eje R","nombre":"Muro eje R","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-27","fin":"2026-10-09","dur":43,"resumen":false},{"id":"t079","area":"BODEGA PRINCIPAL","proceso":"MUROS DE CERRAMIENTO","actividad":"            Muro Eje A-C","nombre":"Muro Eje A-C","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-12","fin":"2026-10-28","dur":46,"resumen":false},{"id":"t080","area":"ENLAMINADOS BODEGA","proceso":"FORRO EN MUROS","actividad":"            Muro eje 1","nombre":"Muro eje 1","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-05","fin":"2026-09-24","dur":50,"resumen":false},{"id":"t081","area":"ENLAMINADOS BODEGA","proceso":"FORRO EN MUROS","actividad":"            Muro eje 8-9","nombre":"Muro eje 8-9","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-02","fin":"2026-11-21","dur":50,"resumen":false},{"id":"t082","area":"ENLAMINADOS BODEGA","proceso":"FORRO EN MUROS","actividad":"            Muro eje R","nombre":"Muro eje R","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-09","fin":"2026-11-28","dur":50,"resumen":false},{"id":"t083","area":"ENLAMINADOS BODEGA","proceso":"FORRO EN MUROS","actividad":"            Muro Eje A-C","nombre":"Muro Eje A-C","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-28","fin":"2026-12-15","dur":48,"resumen":false},{"id":"t084","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"PRIORIDAD 1","nombre":"Prioridad 1 (eje 1 a 2)","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-18","fin":"2026-09-24","dur":37,"resumen":false},{"id":"t085","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"PRIORIDAD 2","nombre":"Prioridad 2 (eje 2 a 3)","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-12","fin":"2026-10-21","dur":39,"resumen":false},{"id":"t086","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"PRIORIDAD 3","nombre":"Prioridad 3 (eje 3 a 4)","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-15","fin":"2026-11-21","dur":37,"resumen":false},{"id":"t087","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"PRIORIDAD 4","nombre":"Prioridad 4 (eje 4 a 6)","pctPlan":0,"pctRealBase":0,"inicio":"2026-11-13","fin":"2026-12-19","dur":36,"resumen":false},{"id":"t088","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"PRIORIDAD 5","nombre":"Prioridad 5 (eje 6 a 7)","pctPlan":0,"pctRealBase":0,"inicio":"2026-12-10","fin":"2027-01-20","dur":41,"resumen":false},{"id":"t089","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"PRIORIDAD 6","nombre":"Prioridad 6 (eje 7 a 9)","pctPlan":0,"pctRealBase":0,"inicio":"2027-01-25","fin":"2027-03-02","dur":36,"resumen":false},{"id":"t090","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"         Canales ","nombre":"Canales","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-30","fin":"2026-10-12","dur":74,"resumen":false},{"id":"t091","area":"ENLAMINADOS BODEGA","proceso":"FORROS CUBIERTA","actividad":"         Flashing","nombre":"Flashing","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-29","fin":"2027-04-06","dur":220,"resumen":false},{"id":"t092","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"         Base ","nombre":"Base","pctPlan":0,"pctRealBase":0,"inicio":"2026-12-01","fin":"2027-02-02","dur":63,"resumen":false},{"id":"t093","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"         Recepcion y Preparacion","nombre":"Recepcion y Preparacion","pctPlan":0,"pctRealBase":0,"inicio":"2027-01-08","fin":"2027-01-20","dur":12,"resumen":false},{"id":"t094","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"PRIORIDAD 1","nombre":"Prioridad 1 (eje 1 a 2)","pctPlan":0,"pctRealBase":0,"inicio":"2027-01-20","fin":"2027-02-02","dur":13,"resumen":false},{"id":"t095","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"PRIORIDAD 2","nombre":"Prioridad 2 (eje 2 a 3)","pctPlan":0,"pctRealBase":0,"inicio":"2027-02-02","fin":"2027-02-13","dur":11,"resumen":false},{"id":"t096","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"PRIORIDAD 6","nombre":"Prioridad 6 (eje 7 a 9)","pctPlan":0,"pctRealBase":0,"inicio":"2027-02-13","fin":"2027-02-25","dur":12,"resumen":false},{"id":"t097","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"PRIORIDAD 3","nombre":"Prioridad 3 (eje 3 a 4)","pctPlan":0,"pctRealBase":0,"inicio":"2027-02-26","fin":"2027-03-10","dur":12,"resumen":false},{"id":"t098","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"PRIORIDAD 4","nombre":"Prioridad 4 (eje 4 a 6)","pctPlan":0,"pctRealBase":0,"inicio":"2027-03-10","fin":"2027-03-22","dur":12,"resumen":false},{"id":"t099","area":"BODEGA PRINCIPAL","proceso":"PISO INDUSTRIAL","actividad":"PRIORIDAD 5","nombre":"Prioridad 5 (eje 6 a 7)","pctPlan":0,"pctRealBase":0,"inicio":"2027-03-23","fin":"2027-04-07","dur":15,"resumen":false},{"id":"t100","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         PRELIMINARES","nombre":"PRELIMINARES","pctPlan":0.75,"pctRealBase":0.75,"inicio":"2026-07-06","fin":"2026-07-11","dur":5,"resumen":false},{"id":"t101","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         OBRA CIVIL","nombre":"OBRA CIVIL","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-13","fin":"2026-08-18","dur":36,"resumen":false},{"id":"t102","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         CONTRAPISO","nombre":"CONTRAPISO","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-18","fin":"2026-08-24","dur":6,"resumen":false},{"id":"t103","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         ESTRUCTURA METÁLICA","nombre":"ESTRUCTURA METÁLICA","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-18","fin":"2026-09-04","dur":17,"resumen":false},{"id":"t104","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         ACABADOS EN MUROS","nombre":"ACABADOS EN MUROS","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-24","fin":"2026-09-10","dur":17,"resumen":false},{"id":"t105","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         ACABADOS EN PISOS","nombre":"ACABADOS EN PISOS","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-24","fin":"2026-09-04","dur":11,"resumen":false},{"id":"t106","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         ACABADOS EN CIELO","nombre":"ACABADOS EN CIELO","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-04","fin":"2026-09-18","dur":14,"resumen":false},{"id":"t107","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         PUERTAS Y VENTANAS","nombre":"PUERTAS Y VENTANAS","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-11","fin":"2026-09-18","dur":7,"resumen":false},{"id":"t108","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         ARTEFACTOS SANITARIOS","nombre":"ARTEFACTOS SANITARIOS","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-18","fin":"2026-09-24","dur":6,"resumen":false},{"id":"t109","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 1","actividad":"         INSTALACIONES HIDROSANITARIAS","nombre":"INSTALACIONES HIDROSANITARIAS","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-13","fin":"2026-08-18","dur":36,"resumen":false},{"id":"t110","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         PRELIMINARES","nombre":"PRELIMINARES","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-05","fin":"2026-08-11","dur":6,"resumen":false},{"id":"t111","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         OBRA CIVIL","nombre":"OBRA CIVIL","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-12","fin":"2026-09-18","dur":37,"resumen":false},{"id":"t112","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         CONTRAPISO","nombre":"CONTRAPISO","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-18","fin":"2026-09-24","dur":6,"resumen":false},{"id":"t113","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         ESTRUCTURA METÁLICA","nombre":"ESTRUCTURA METÁLICA","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-18","fin":"2026-10-06","dur":18,"resumen":false},{"id":"t114","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         ACABADOS EN MUROS","nombre":"ACABADOS EN MUROS","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-24","fin":"2026-10-13","dur":19,"resumen":false},{"id":"t115","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         ACABADOS EN PISOS","nombre":"ACABADOS EN PISOS","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-24","fin":"2026-10-06","dur":12,"resumen":false},{"id":"t116","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         ACABADOS EN CIELO","nombre":"ACABADOS EN CIELO","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-07","fin":"2026-10-19","dur":12,"resumen":false},{"id":"t117","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         PUERTAS Y VENTANAS","nombre":"PUERTAS Y VENTANAS","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-13","fin":"2026-10-19","dur":6,"resumen":false},{"id":"t118","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         ARTEFACTOS SANITARIOS","nombre":"ARTEFACTOS SANITARIOS","pctPlan":0,"pctRealBase":0,"inicio":"2026-10-19","fin":"2026-10-26","dur":7,"resumen":false},{"id":"t119","area":"COMPLEMENTARIAS URBA","proceso":"GARITA 2","actividad":"         INSTALACIONES HIDROSANITARIAS","nombre":"INSTALACIONES HIDROSANITARIAS","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-12","fin":"2026-09-18","dur":37,"resumen":false},{"id":"t120","area":"OFICINA ZDEEP","proceso":"OBRA CIVIL","actividad":"         RECEPCION DE BASE","nombre":"RECEPCION DE BASE","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-04","fin":"2026-06-04","dur":1,"resumen":false},{"id":"t121","area":"OFICINA ZDEEP","proceso":"OBRA CIVIL","actividad":"         TRAZO Y REPLANTEO","nombre":"TRAZO Y REPLANTEO","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-05","fin":"2026-06-09","dur":4,"resumen":false},{"id":"t122","area":"OFICINA ZDEEP","proceso":"OBRA CIVIL","actividad":"         EXCAVACION Y PERFILADO","nombre":"EXCAVACION Y PERFILADO","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-09","fin":"2026-06-17","dur":8,"resumen":false},{"id":"t123","area":"OFICINA ZDEEP","proceso":"OBRA CIVIL","actividad":"         ARMADURA Y CENTRADO","nombre":"ARMADURA Y CENTRADO","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-17","fin":"2026-06-29","dur":12,"resumen":false},{"id":"t124","area":"OFICINA ZDEEP","proceso":"OBRA CIVIL","actividad":"         FUNDICION DE CIMIENTO","nombre":"FUNDICION DE CIMIENTO","pctPlan":1,"pctRealBase":1,"inicio":"2026-07-01","fin":"2026-07-02","dur":1,"resumen":false},{"id":"t125","area":"OFICINA ZDEEP","proceso":"OBRA CIVIL","actividad":"         LEVANTADOS","nombre":"LEVANTADOS","pctPlan":0.9,"pctRealBase":0.45,"inicio":"2026-07-03","fin":"2026-07-27","dur":24,"resumen":false},{"id":"t126","area":"OFICINA ZDEEP","proceso":"OBRA CIVIL","actividad":"         CONTRAPISO (PREPARACION Y FUNDICION)","nombre":"CONTRAPISO (PREPARACION Y FUNDICION)","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-28","fin":"2026-08-05","dur":8,"resumen":false},{"id":"t127","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         FABRICACION Y TRASLADO","nombre":"FABRICACION Y TRASLADO","pctPlan":0.57,"pctRealBase":0.5,"inicio":"2026-07-03","fin":"2026-07-21","dur":18,"resumen":false},{"id":"t128","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         INSTALACION","nombre":"INSTALACION","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-28","fin":"2026-08-05","dur":8,"resumen":false},{"id":"t129","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         LAMINA ","nombre":"LAMINA","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-05","fin":"2026-08-11","dur":6,"resumen":false},{"id":"t130","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         ACABADOS EN MUROS","nombre":"ACABADOS EN MUROS","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-11","fin":"2026-09-04","dur":24,"resumen":false},{"id":"t131","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         ACABADOS EN PISOS","nombre":"ACABADOS EN PISOS","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-11","fin":"2026-08-28","dur":17,"resumen":false},{"id":"t132","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         ACABADOS EN CIELO","nombre":"ACABADOS EN CIELO","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-11","fin":"2026-08-28","dur":17,"resumen":false},{"id":"t133","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         INSTALACION DE PUERTAS Y VENTANAS","nombre":"INSTALACION DE PUERTAS Y VENTANAS","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-04","fin":"2026-09-10","dur":6,"resumen":false},{"id":"t134","area":"OFICINA ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"         INSTALACION DE ARTEFACTOS SANITARIOS","nombre":"INSTALACION DE ARTEFACTOS SANITARIOS","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-29","fin":"2026-09-04","dur":6,"resumen":false},{"id":"t135","area":"OFICINA ZDEEP","proceso":"INSTALACIONES ELECTRICAS","actividad":"            FUERZA","nombre":"FUERZA","pctPlan":0.24,"pctRealBase":0,"inicio":"2026-07-03","fin":"2026-08-14","dur":42,"resumen":false},{"id":"t136","area":"OFICINA ZDEEP","proceso":"INSTALACIONES ELECTRICAS","actividad":"            ILUMINACIÓN","nombre":"ILUMINACIÓN","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-14","fin":"2026-09-02","dur":19,"resumen":false},{"id":"t137","area":"OFICINA ZDEEP","proceso":"INSTALACIONES HIDROSANITARIAS","actividad":"            AGUA POTABLE","nombre":"AGUA POTABLE","pctPlan":0.19,"pctRealBase":0.05,"inicio":"2026-07-03","fin":"2026-08-26","dur":54,"resumen":false},{"id":"t138","area":"OFICINA ZDEEP","proceso":"INSTALACIONES HIDROSANITARIAS","actividad":"            DRENAJE","nombre":"DRENAJE","pctPlan":0.25,"pctRealBase":0.2,"inicio":"2026-07-03","fin":"2026-08-26","dur":54,"resumen":false},{"id":"t139","area":"OFICINA ZDEEP","proceso":"INSTALACIONES HIDROSANITARIAS","actividad":"            PLUVIAL","nombre":"PLUVIAL","pctPlan":0.19,"pctRealBase":0.05,"inicio":"2026-07-03","fin":"2026-08-26","dur":54,"resumen":false},{"id":"t140","area":"OFICINA ZDEEP","proceso":"RCI","actividad":"            INSTALACION DE EXTINTORES","nombre":"INSTALACION DE EXTINTORES","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-29","fin":"2026-09-04","dur":6,"resumen":false},{"id":"t141","area":"OFICINA ZDEEP","proceso":"HVAC","actividad":"            INSTALACION DE EQUIPOS ","nombre":"INSTALACION DE EQUIPOS","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-02","fin":"2026-10-03","dur":31,"resumen":false},{"id":"t142","area":"ALMACEN ZDEEP","proceso":"PRELIMINARES","actividad":"      RECEPCION DE BASE","nombre":"RECEPCION DE BASE","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-09","fin":"2026-06-10","dur":1,"resumen":false},{"id":"t143","area":"ALMACEN ZDEEP","proceso":"PRELIMINARES","actividad":"      TRAZO ","nombre":"TRAZO","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-09","fin":"2026-06-11","dur":2,"resumen":false},{"id":"t144","area":"ALMACEN ZDEEP","proceso":"CIMENTACION","actividad":"            EXCAVACION Y PERFILADO","nombre":"EXCAVACION Y PERFILADO","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-11","fin":"2026-06-18","dur":7,"resumen":false},{"id":"t145","area":"ALMACEN ZDEEP","proceso":"CIMENTACION","actividad":"            ARMADURA Y CENTRADO","nombre":"ARMADURA Y CENTRADO","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-18","fin":"2026-06-23","dur":5,"resumen":false},{"id":"t146","area":"ALMACEN ZDEEP","proceso":"CIMENTACION","actividad":"            CENTRADO DE PERNOS","nombre":"CENTRADO DE PERNOS","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-23","fin":"2026-06-24","dur":1,"resumen":false},{"id":"t147","area":"ALMACEN ZDEEP","proceso":"CIMENTACION","actividad":"            FUNDICION DE ZAPATAS","nombre":"FUNDICION DE ZAPATAS","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-24","fin":"2026-06-26","dur":2,"resumen":false},{"id":"t148","area":"ALMACEN ZDEEP","proceso":"CIMENTACION","actividad":"            IMPERMEABILIZACION Y RELLENO","nombre":"IMPERMEABILIZACION Y RELLENO","pctPlan":1,"pctRealBase":0,"inicio":"2026-06-26","fin":"2026-07-02","dur":6,"resumen":false},{"id":"t149","area":"ALMACEN ZDEEP","proceso":"MURO DE CONTENCION","actividad":"            TRAZO Y REPLANTEO ","nombre":"TRAZO Y REPLANTEO","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-18","fin":"2026-06-20","dur":2,"resumen":false},{"id":"t150","area":"ALMACEN ZDEEP","proceso":"MURO DE CONTENCION","actividad":"            EXCAVACIÓN","nombre":"EXCAVACIÓN","pctPlan":1,"pctRealBase":1,"inicio":"2026-06-20","fin":"2026-06-24","dur":4,"resumen":false},{"id":"t151","area":"ALMACEN ZDEEP","proceso":"MURO DE CONTENCION","actividad":"            ARMADURA Y CENTRADO","nombre":"ARMADURA Y CENTRADO","pctPlan":1,"pctRealBase":0.96,"inicio":"2026-06-20","fin":"2026-07-07","dur":17,"resumen":false},{"id":"t152","area":"ALMACEN ZDEEP","proceso":"MURO DE CONTENCION","actividad":"            FUNDICIÓN DE CIMIENTO","nombre":"FUNDICIÓN DE CIMIENTO","pctPlan":1,"pctRealBase":0.45,"inicio":"2026-07-07","fin":"2026-07-09","dur":2,"resumen":false},{"id":"t153","area":"ALMACEN ZDEEP","proceso":"MURO DE CONTENCION","actividad":"            ECOFRADO DE MURO ","nombre":"ECOFRADO DE MURO","pctPlan":0.39,"pctRealBase":0,"inicio":"2026-07-09","fin":"2026-07-17","dur":8,"resumen":false},{"id":"t154","area":"ALMACEN ZDEEP","proceso":"MURO DE CONTENCION","actividad":"            FUNDICION DE MURO ","nombre":"FUNDICION DE MURO","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-17","fin":"2026-07-18","dur":1,"resumen":false},{"id":"t155","area":"ALMACEN ZDEEP","proceso":"MURO DE CONTENCION","actividad":"            IMPERMEABILIZACION Y RELLENO","nombre":"IMPERMEABILIZACION Y RELLENO","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-18","fin":"2026-07-24","dur":6,"resumen":false},{"id":"t156","area":"ALMACEN ZDEEP","proceso":"PISO","actividad":"            PREPARACION DE BASE","nombre":"PREPARACION DE BASE","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-24","fin":"2026-07-29","dur":5,"resumen":false},{"id":"t157","area":"ALMACEN ZDEEP","proceso":"PISO","actividad":"            FUNDICION DE CONTRAPISO","nombre":"FUNDICION DE CONTRAPISO","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-30","fin":"2026-07-30","dur":1,"resumen":false},{"id":"t158","area":"ALMACEN ZDEEP","proceso":"PISO","actividad":"            RAMPA","nombre":"RAMPA","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-31","fin":"2026-08-07","dur":7,"resumen":false},{"id":"t159","area":"ALMACEN ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"            FABRICACION Y TRASLADO","nombre":"FABRICACION Y TRASLADO","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-21","fin":"2026-08-05","dur":15,"resumen":false},{"id":"t160","area":"ALMACEN ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"            INSTALACION","nombre":"INSTALACION","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-05","fin":"2026-08-17","dur":12,"resumen":false},{"id":"t161","area":"ALMACEN ZDEEP","proceso":"ESTRUCTURA METALICA","actividad":"            INSTALACION DE LAMINA","nombre":"INSTALACION DE LAMINA","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-17","fin":"2026-08-26","dur":9,"resumen":false},{"id":"t162","area":"ALMACEN ZDEEP","proceso":"INSTALACIONES ELECTRICAS","actividad":"            FUERZA","nombre":"FUERZA","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-24","fin":"2026-08-24","dur":31,"resumen":false},{"id":"t163","area":"ALMACEN ZDEEP","proceso":"INSTALACIONES ELECTRICAS","actividad":"            ILUMINACIÓN","nombre":"ILUMINACIÓN","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-17","fin":"2026-09-17","dur":31,"resumen":false},{"id":"t164","area":"ALMACEN ZDEEP","proceso":"INSTALACIONES ELECTRICAS","actividad":"            RCI","nombre":"RCI","pctPlan":0,"pctRealBase":0,"inicio":"2026-09-17","fin":"2026-09-23","dur":6,"resumen":false},{"id":"t165","area":"ALMACEN ZDEEP","proceso":"INSTALACIONES HIDROSANITARIAS","actividad":"            PLUVIAL ","nombre":"PLUVIAL","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-30","fin":"2026-09-04","dur":36,"resumen":false},{"id":"t166","area":"ALMACEN ZDEEP","proceso":"INSTALACIONES HIDROSANITARIAS","actividad":"            DRENAJE ","nombre":"DRENAJE","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-30","fin":"2026-09-04","dur":36,"resumen":false},{"id":"t167","area":"ALMACEN ZDEEP","proceso":"INSTALACIONES HIDROSANITARIAS","actividad":"            AGUA POTABLE","nombre":"AGUA POTABLE","pctPlan":0,"pctRealBase":0,"inicio":"2026-07-30","fin":"2026-09-04","dur":36,"resumen":false},{"id":"t168","area":"ALMACEN ZDEEP","proceso":"ACABADOS","actividad":"            CERRAMIENTO PERIMETRAL CON MALLA","nombre":"CERRAMIENTO PERIMETRAL CON MALLA","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-17","fin":"2026-08-28","dur":11,"resumen":false},{"id":"t169","area":"ALMACEN ZDEEP","proceso":"ACABADOS","actividad":"            INSTALACION DE CORTINA METALICA","nombre":"INSTALACION DE CORTINA METALICA","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-29","fin":"2026-09-04","dur":6,"resumen":false},{"id":"t170","area":"ALMACEN ZDEEP","proceso":"ACABADOS","actividad":"            INSTALACION DE BARANDAS","nombre":"INSTALACION DE BARANDAS","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-07","fin":"2026-08-19","dur":12,"resumen":false},{"id":"t171","area":"ALMACEN ZDEEP","proceso":"ACABADOS","actividad":"            SEÑALIZACION","nombre":"SEÑALIZACION","pctPlan":0,"pctRealBase":0,"inicio":"2026-08-19","fin":"2026-09-01","dur":13,"resumen":false}];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PATCH,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(obj, status) {
  status = status || 200;
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: Object.assign({ "Content-Type": "application/json" }, CORS_HEADERS),
  });
}

async function getTaskState(env, id) {
  var raw = await env.YAZAKI_KV.get("state:" + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Calcula el % esperado de avance segun cuanto tiempo ha transcurrido entre
// la fecha de inicio y fin de una tarea, comparado con la fecha de hoy.
// Reemplaza el antiguo "% Completado" fijo del Excel: este valor se
// recalcula solo, todos los dias, sin necesidad de mantenerlo a mano.
function computeExpectedPct(inicioStr, finStr) {
  if (!inicioStr || !finStr) return 0;
  var ini = new Date(inicioStr + "T00:00:00Z").getTime();
  var fin = new Date(finStr + "T00:00:00Z").getTime();
  var now = Date.now();
  var dur = fin - ini;
  var frac;
  if (dur <= 0) {
    frac = now >= ini ? 1 : 0;
  } else {
    frac = (now - ini) / dur;
    if (frac < 0) frac = 0;
    if (frac > 1) frac = 1;
  }
  return frac;
}

// Construye la lista completa leyendo los 171 estados individuales de KV.
// COSTOSA: hace una lectura de KV por cada tarea. Solo se usa una vez, para
// "arrancar" el cache la primera vez, o si alguien pide reconstruirlo a mano.
async function buildFullTaskListFromIndividualStates(env) {
  var states = await Promise.all(
    SCHEDULE.map(function (row) {
      return getTaskState(env, row.id);
    })
  );
  return SCHEDULE.map(function (row, i) {
    var state = states[i];
    var pctReal = state && typeof state.pctReal === "number" ? state.pctReal : row.pctRealBase;
    return {
      id: row.id,
      area: row.area,
      proceso: row.proceso,
      actividad: row.actividad,
      nombre: row.nombre,
      pctPlan: computeExpectedPct(row.inicio, row.fin),
      pctReal: pctReal,
      inicio: row.inicio,
      fin: row.fin,
      dur: row.dur,
      resumen: row.resumen,
      updatedBy: state ? state.updatedBy || null : null,
      updatedAt: state ? state.updatedAt || null : null,
    };
  });
}

var CACHE_KEY = "cache:tasks_v1";

async function getCachedTasks(env) {
  var raw = await env.YAZAKI_KV.get(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function setCachedTasks(env, tasksArray) {
  await env.YAZAKI_KV.put(CACHE_KEY, JSON.stringify(tasksArray));
}

// Forma BARATA de obtener la lista de tareas: 1 sola lectura de KV (el cache),
// en vez de 171. El % esperado se recalcula siempre en vivo porque depende
// de la fecha de hoy y no debe quedar guardado en el cache.
async function getTasksListCheap(env) {
  var cached = await getCachedTasks(env);
  if (cached) {
    return cached.map(function (t) {
      return {
        id: t.id, area: t.area, proceso: t.proceso, actividad: t.actividad, nombre: t.nombre,
        pctPlan: computeExpectedPct(t.inicio, t.fin), pctReal: t.pctReal,
        inicio: t.inicio, fin: t.fin, dur: t.dur, resumen: t.resumen,
        updatedBy: t.updatedBy, updatedAt: t.updatedAt,
      };
    });
  }
  // No existe cache todavia (primera vez tras este despliegue): se construye
  // una sola vez leyendo los estados individuales (esto preserva todo lo que
  // los supervisores ya habian reportado antes de este cambio) y se guarda.
  var fresh = await buildFullTaskListFromIndividualStates(env);
  await setCachedTasks(env, fresh);
  return fresh;
}

function computeSummary(tasks) {
  var leaf = tasks.filter(function (t) { return !t.resumen; });
  var totalDur = leaf.reduce(function (acc, t) { return acc + t.dur; }, 0);

  function weighted(list) {
    var dur = list.reduce(function (acc, t) { return acc + t.dur; }, 0);
    if (dur === 0) return { pctPlan: 0, pctReal: 0, dur: 0 };
    var plan = list.reduce(function (acc, t) { return acc + t.pctPlan * t.dur; }, 0) / dur;
    var real = list.reduce(function (acc, t) { return acc + t.pctReal * t.dur; }, 0) / dur;
    return { pctPlan: plan, pctReal: real, dur: dur };
  }

  var global = weighted(leaf);

  var byArea = {};
  var areaOrder = [];
  leaf.forEach(function (t) {
    if (!byArea[t.area]) {
      byArea[t.area] = [];
      areaOrder.push(t.area);
    }
    byArea[t.area].push(t);
  });
  var areas = areaOrder.map(function (area) {
    var w = weighted(byArea[area]);
    return {
      area: area,
      pctPlan: w.pctPlan,
      pctReal: w.pctReal,
      dur: w.dur,
      pesoProyecto: totalDur > 0 ? w.dur / totalDur : 0,
      desviacion: w.pctReal - w.pctPlan,
    };
  });

  var byProceso = {};
  var procesoOrder = [];
  leaf.forEach(function (t) {
    var key = t.area + " | " + t.proceso;
    if (!byProceso[key]) {
      byProceso[key] = { area: t.area, proceso: t.proceso, tasks: [] };
      procesoOrder.push(key);
    }
    byProceso[key].tasks.push(t);
  });
  var procesos = procesoOrder.map(function (key) {
    var g = byProceso[key];
    var w = weighted(g.tasks);
    return {
      area: g.area,
      proceso: g.proceso,
      pctPlan: w.pctPlan,
      pctReal: w.pctReal,
      dur: w.dur,
      desviacion: w.pctReal - w.pctPlan,
    };
  });

  return {
    global: { pctPlan: global.pctPlan, pctReal: global.pctReal, desviacion: global.pctReal - global.pctPlan, totalDur: totalDur },
    areas: areas,
    procesos: procesos,
    totalTareas: leaf.length,
    generadoEn: new Date().toISOString(),
  };
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    var path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (path === "/api/tasks" && request.method === "GET") {
      var tasks = await getTasksListCheap(env);
      return jsonResponse({ tasks: tasks });
    }

    if (path === "/api/summary" && request.method === "GET") {
      var tasksForSummary = await getTasksListCheap(env);
      return jsonResponse(computeSummary(tasksForSummary));
    }

    // Endpoint de mantenimiento: reconstruye el cache desde cero leyendo los
    // 171 estados individuales. Normalmente no hace falta usarlo, pero sirve
    // como "boton de emergencia" si el cache alguna vez queda desincronizado.
    if (path === "/api/rebuild-cache" && request.method === "GET") {
      var rebuilt = await buildFullTaskListFromIndividualStates(env);
      await setCachedTasks(env, rebuilt);
      return jsonResponse({ ok: true, tareas: rebuilt.length, mensaje: "Cache reconstruido desde los estados individuales." });
    }

    var match = path.match(/^\/api\/tasks\/([a-zA-Z0-9_-]+)$/);
    if (match && request.method === "PATCH") {
      var id = match[1];
      var row = SCHEDULE.find(function (r) { return r.id === id; });
      if (!row) {
        return jsonResponse({ error: "Tarea no encontrada" }, 404);
      }
      if (row.resumen) {
        return jsonResponse({ error: "Esta fila es un resumen de grupo y no se reporta directamente" }, 400);
      }
      var body;
      try {
        body = await request.json();
      } catch (e) {
        return jsonResponse({ error: "JSON invalido" }, 400);
      }
      var pctReal = Number(body.pctReal);
      if (isNaN(pctReal) || pctReal < 0 || pctReal > 1) {
        return jsonResponse({ error: "pctReal debe ser un numero entre 0 y 1" }, 400);
      }
      var newState = {
        pctReal: pctReal,
        updatedBy: body.updatedBy || "supervisor",
        updatedAt: new Date().toISOString(),
      };

      // 1) Escritura durable individual: fuente de verdad, segura ante
      //    varios supervisores guardando al mismo tiempo en tareas distintas.
      await env.YAZAKI_KV.put("state:" + id, JSON.stringify(newState));

      // 2) Actualizar el cache agregado (barato: 1 lectura + 1 escritura,
      //    no 171). Si el cache no existiera todavia, se arma una sola vez.
      var cached = await getCachedTasks(env);
      if (!cached) {
        cached = await buildFullTaskListFromIndividualStates(env);
      }
      var updatedCache = cached.map(function (t) {
        if (t.id === id) {
          return {
            id: t.id, area: t.area, proceso: t.proceso, actividad: t.actividad, nombre: t.nombre,
            pctPlan: t.pctPlan, pctReal: pctReal,
            inicio: t.inicio, fin: t.fin, dur: t.dur, resumen: t.resumen,
            updatedBy: newState.updatedBy, updatedAt: newState.updatedAt,
          };
        }
        return t;
      });
      await setCachedTasks(env, updatedCache);

      return jsonResponse({ ok: true, id: id, state: newState });
    }

    return jsonResponse({ error: "Ruta no encontrada" }, 404);
  },
};
