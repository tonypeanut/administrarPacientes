const nombreCache = 'apv-v5';
const archivos = [
    '/',
    '/index.html',
    '/error.html',
    '/css/styles.css',
    '/css/bootstrap.css',
    '/js/main.js',
    '/js/DB.js',
    '/js/funciones.js',
    '/js/selectores.js',
    '/js/classes/App.js',
    '/js/classes/Citas.js',
    '/js/classes/UI.js',
    '/manifest.json',
];

// Cuando se instala el service worker
self.addEventListener('install', e=> {
    console.log('Instalando el Service worker');
    
    e.waitUntil(
        caches.open(nombreCache)
            .then(cache => {
                console.log('cacheando');
                cache.addAll(archivos);
            })
            .catch(error => console.log(error))
    )
})

// Activar el Service worker
self.addEventListener('activate', e=>{
    console.log('Service worker activado');
    
    e.waitUntil(
        caches.keys()
            .then ( keys => {
                return Promise.all(
                    keys.filter( key => key !== nombreCache)
                        .map( key=> caches.delete (key))
                )
            })
    )
})

// Evento fetch para descargar archivos estatico
self.addEventListener('fetch',e=> {
    console.log('Fetch... ', e.request);
    
    e.respondWith( () => 
        caches.match(e.request)
            .then(respuestaCache => respuestaCache)
            .catch(()=> caches.match('/error.html'))
    ) 
})
    