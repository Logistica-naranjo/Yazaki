# Sistema de Monitoreo YAZAKI — Constructora E4 SA

Mismo patrón que Capital Industrial: 2 apps estáticas (GitHub Pages) + 1 Worker con
Cloudflare KV como backend. El cronograma (171 actividades del Excel "al 160726") ya
está embebido como datos fijos dentro del Worker; el KV solo guarda lo que cambia:
el **% Real** que reporta cada supervisor, quién lo reportó y cuándo.

## Estructura del proyecto

```
yazaki/
├── worker/
│   ├── worker.js          # Backend: API + cronograma embebido
│   └── wrangler.toml      # Config de despliegue del Worker
├── campo/
│   └── index.html         # App de campo (supervisores) — editable
└── dashboard/
    └── index.html         # Dashboard cliente — solo lectura
```

## Cómo se ponderó el avance

Se ponderó **por duración en días** de cada actividad (tal como pediste), no por
cantidad de actividades. De las 171 filas del Excel, 3 son filas "resumen" que
MS Project genera automáticamente agrupando a otras filas (ej. "PRELIMINARES" como
encabezado de sus 3 subtareas, o "Prioridad 1"/"Prioridad 2" de Cimentación que
agrupan sus 9 subtareas cada una). Esas 3 filas se excluyen del cálculo para no
duplicar el peso de esos días — las 168 filas restantes son las que el supervisor
reporta en campo y las que alimentan el % ponderado global, por área y por proceso.

Pesos actuales por área (sobre 3,356 días totales del proyecto):

| Área | Peso |
|---|---|
| Bodega Principal | 27.5% |
| Enlaminados Bodega | 21.4% |
| Estructura Metálica Bodega | 18.4% |
| Oficina ZDEEP | 12.5% |
| Almacén ZDEEP | 9.9% |
| Complementarias URBA | 9.4% |
| Preliminares | 0.9% |

## 1. Desplegar el Worker (backend)

```bash
cd worker
npm install -g wrangler   # si no lo tienes instalado
wrangler login

# Crear el namespace de KV (una sola vez)
wrangler kv namespace create YAZAKI_KV
# Copia el "id" que te devuelve y pégalo en wrangler.toml donde dice
# PEGAR_AQUI_EL_ID_DEL_NAMESPACE

wrangler deploy
```

Al terminar, Wrangler te da la URL del Worker, algo como:
`https://yazaki-monitoreo.tu-subdominio.workers.dev`

**No hace falta poblar el KV manualmente**: si una tarea todavía no tiene estado
guardado en KV, el Worker usa el % Real que traía el Excel original como valor
inicial. Desde ahí, cada actualización de un supervisor va sobrescribiendo solo
esa tarea puntual en KV (por eso no hay conflictos de concurrencia entre
supervisores editando tareas distintas al mismo tiempo).

## 2. Conectar las apps al Worker

En **ambos** archivos HTML (`campo/index.html` y `dashboard/index.html`) busca esta línea
cerca del final del `<script>`:

```javascript
var API_BASE = "https://yazaki-monitoreo.TU-SUBDOMINIO.workers.dev";
```

Reemplázala por la URL real que te dio `wrangler deploy`.

## 3. Publicar en GitHub Pages

Mismo patrón que Capital Industrial:

```bash
git init
git add campo/index.html dashboard/index.html
git commit -m "YAZAKI: apps de monitoreo"
git remote add origin <tu-repo>
git push -u origin main
```

Activa GitHub Pages apuntando a la raíz o a `/docs`, según cómo lo tengas
organizado. Vas a tener dos URLs, una por carpeta:

- `https://tu-usuario.github.io/tu-repo/campo/` → app de supervisores
- `https://tu-usuario.github.io/tu-repo/dashboard/` → dashboard cliente

**Recuerda el patrón de cache-busting**: cuando subas una actualización de
alguno de los HTML, renombra el archivo (o agrega un parámetro de versión) para
forzar que los navegadores no sirvan la versión cacheada, tal como lo veníamos
haciendo en Capital Industrial.

## 4. Actualizar el cronograma base más adelante

Si en el futuro Juanfer sube un nuevo Excel de cronograma (parte 2, o una
actualización de fechas/pesos), lo que cambia es únicamente el arreglo `SCHEDULE`
dentro de `worker.js` — el KV con el avance reportado por los supervisores no se
toca, así que no se pierde nada de lo ya reportado en campo (mientras los `id` de
tarea se mantengan).

## Endpoints del Worker

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/tasks` | Lista completa de tareas con su estado actual (usado por la app de campo) |
| GET | `/api/summary` | Avance ponderado global, por área y por proceso (usado por el dashboard) |
| PATCH | `/api/tasks/:id` | Actualiza el % Real de una tarea puntual (body: `{ "pctReal": 0.65, "updatedBy": "nombre" }`) |
