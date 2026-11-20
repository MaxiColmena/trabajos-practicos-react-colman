const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'assets', 'capturas');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function frameWrapper(content, title = 'Mantenimiento IPF', subtitle = '', showBack = false, activeTab = null) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 820" width="400" height="820" style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.1" />
    </filter>
    <filter id="modalShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-opacity="0.25" />
    </filter>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
  </defs>

  <!-- Device Frame (Titanium Gray / Slate) -->
  <rect x="5" y="5" width="390" height="810" rx="42" fill="#0F172A" stroke="#334155" stroke-width="4"/>
  
  <!-- Screen Area -->
  <rect x="15" y="15" width="370" height="790" rx="34" fill="#F8FAFC"/>
  
  <!-- Status Bar -->
  <rect x="15" y="15" width="370" height="38" fill="#1E3A8A" rx="34" clip-path="url(#statusBarClip)"/>
  <rect x="15" y="35" width="370" height="18" fill="#1E3A8A"/>
  
  <!-- Dynamic Island -->
  <rect x="145" y="22" width="110" height="24" rx="12" fill="#020617"/>
  <circle cx="236" cy="34" r="5" fill="#1E293B"/>

  <!-- Status Bar Items -->
  <text x="42" y="38" fill="#FFFFFF" font-size="12" font-weight="700">09:41</text>
  <!-- Signal bars -->
  <rect x="312" y="32" width="3" height="4" fill="#FFFFFF" rx="1"/>
  <rect x="317" y="30" width="3" height="6" fill="#FFFFFF" rx="1"/>
  <rect x="322" y="28" width="3" height="8" fill="#FFFFFF" rx="1"/>
  <rect x="327" y="26" width="3" height="10" fill="#FFFFFF" rx="1"/>
  <!-- Wifi icon -->
  <path d="M 336 29 A 6 6 0 0 1 346 29 M 338 32 A 3 3 0 0 1 344 32 M 341 35 A 0.5 0.5 0 0 1 341 36" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Battery -->
  <rect x="352" y="27" width="20" height="10" rx="3" fill="none" stroke="#FFFFFF" stroke-width="1.2"/>
  <rect x="354" y="29" width="14" height="6" rx="1.5" fill="#10B981"/>
  <path d="M 373 30 L 373 34" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>

  <!-- App Header -->
  <rect x="15" y="53" width="370" height="54" fill="url(#headerGrad)"/>
  ${showBack ? `
    <g transform="translate(25, 70)" cursor="pointer">
      <circle cx="12" cy="12" r="14" fill="rgba(255,255,255,0.15)"/>
      <path d="M 15 7 L 10 12 L 15 17" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="60" y="76" fill="#FFFFFF" font-size="16" font-weight="800">${title}</text>
    <text x="60" y="93" fill="#93C5FD" font-size="11" font-weight="500">${subtitle}</text>
  ` : `
    <text x="32" y="76" fill="#FFFFFF" font-size="16" font-weight="800">${title}</text>
    <text x="32" y="93" fill="#93C5FD" font-size="11" font-weight="500">${subtitle}</text>
    <g transform="translate(345, 68)">
      <circle cx="12" cy="12" r="14" fill="rgba(255,255,255,0.15)"/>
      <text x="6" y="17" font-size="13">⚙️</text>
    </g>
  `}

  <!-- Screen Content Body -->
  ${content}

  <!-- Bottom Navigation Tab Bar (if activeTab is set) -->
  ${activeTab ? `
    <rect x="15" y="730" width="370" height="58" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <!-- Tab 1: Reportes -->
    <g transform="translate(55, 738)" cursor="pointer">
      <text x="12" y="20" font-size="18" text-anchor="middle">${activeTab === 'reportes' ? '📋' : '📑'}</text>
      <text x="12" y="36" font-size="10" font-weight="${activeTab === 'reportes' ? '700' : '500'}" fill="${activeTab === 'reportes' ? '#2563EB' : '#64748B'}" text-anchor="middle">Reportes</text>
    </g>
    <!-- Tab 2: Avisos -->
    <g transform="translate(185, 738)" cursor="pointer">
      <text x="12" y="20" font-size="18" text-anchor="middle">${activeTab === 'avisos' ? '🔔' : '🔕'}</text>
      <text x="12" y="36" font-size="10" font-weight="${activeTab === 'avisos' ? '700' : '500'}" fill="${activeTab === 'avisos' ? '#2563EB' : '#64748B'}" text-anchor="middle">Avisos</text>
    </g>
    <!-- Tab 3: Permisos -->
    <g transform="translate(315, 738)" cursor="pointer">
      <text x="12" y="20" font-size="18" text-anchor="middle">🛡️</text>
      <text x="12" y="36" font-size="10" font-weight="${activeTab === 'permisos' ? '700' : '500'}" fill="${activeTab === 'permisos' ? '#2563EB' : '#64748B'}" text-anchor="middle">Permisos</text>
    </g>
  ` : ''}

  <!-- Home Indicator -->
  <rect x="135" y="792" width="130" height="4" rx="2" fill="#94A3B8"/>
</svg>`;
}

// -------------------------------------------------------------
// 1. Escáner - Estado 1: Cargando
// -------------------------------------------------------------
const svg01 = frameWrapper(`
  <g transform="translate(25, 260)">
    <rect x="0" y="0" width="350" height="260" rx="16" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <g transform="translate(175, 90)">
      <circle cx="0" cy="0" r="28" stroke="#DBEAFE" stroke-width="5" fill="none"/>
      <path d="M 0 -28 A 28 28 0 0 1 28 0" stroke="#2563EB" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
    <text x="175" y="150" font-size="15" font-weight="700" fill="#0F172A" text-anchor="middle">Estado 1: Cargando...</text>
    <text x="175" y="175" font-size="13" fill="#64748B" text-anchor="middle">Verificando permisos del dispositivo...</text>
    <rect x="85" y="198" width="180" height="28" rx="14" fill="#EFF6FF"/>
    <text x="175" y="217" font-size="11" font-weight="600" fill="#2563EB" text-anchor="middle">useCameraPermissions()[0] === null</text>
  </g>
`, 'Escanear Código QR', 'Comprobando cámara...', true);

// -------------------------------------------------------------
// 2. Escáner - Estado 2: Preguntable (Pantalla Previa)
// -------------------------------------------------------------
const svg02 = frameWrapper(`
  <g transform="translate(25, 125)">
    <!-- Card principal estado preguntable -->
    <rect x="0" y="0" width="350" height="340" rx="18" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    
    <circle cx="175" cy="50" r="30" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="2"/>
    <text x="175" y="58" font-size="28" text-anchor="middle">📷</text>
    
    <text x="175" y="105" font-size="17" font-weight="800" fill="#0F172A" text-anchor="middle">Estado 2: Preguntable</text>
    <text x="175" y="125" font-size="12" font-weight="600" fill="#D97706" text-anchor="middle">status: "undetermined" | canAskAgain: true</text>
    
    <rect x="20" y="140" width="310" height="68" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="32" y="162" font-size="12" font-weight="700" fill="#1E3A8A">Texto de propósito propio (app.json):</text>
    <text x="32" y="180" font-size="11.5" font-style="italic" fill="#334155">"Usamos tu cámara para escanear el código QR</text>
    <text x="32" y="196" font-size="11.5" font-style="italic" fill="#334155">del aula y autocompletar la ubicación."</text>

    <!-- Botón Continuar (único botón afirmativo según pauta Apple) -->
    <rect x="25" y="225" width="300" height="44" rx="12" fill="#2563EB"/>
    <text x="175" y="252" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">Continuar</text>

    <text x="175" y="295" font-size="11" fill="#64748B" text-anchor="middle">Al presionar, el SO abrirá el diálogo nativo</text>
    <text x="175" y="312" font-size="10.5" fill="#94A3B8" text-anchor="middle">Podés modificarlo luego desde los Ajustes</text>
  </g>

  <!-- Alternativa a mano (Requisito: la app nunca se bloquea) -->
  <g transform="translate(25, 485)">
    <rect x="0" y="0" width="350" height="150" rx="14" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <text x="20" y="28" font-size="13" font-weight="700" fill="#0F172A">Alternativa: Escribir aula a mano</text>
    <text x="20" y="46" font-size="11.5" fill="#64748B">Si preferís no otorgar cámara, ingresá el aula:</text>
    
    <rect x="20" y="58" width="310" height="38" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="32" y="82" font-size="13" fill="#94A3B8">Ej: Aula Magna, Taller 1...</text>
    
    <rect x="20" y="104" width="310" height="34" rx="8" fill="#0F172A"/>
    <text x="175" y="125" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Usar aula escrita a mano</text>
  </g>
`, 'Escanear QR del Aula', 'Permiso requerido', true);

// -------------------------------------------------------------
// 3. Escáner - Estado 3: Concedido (Visor activo)
// -------------------------------------------------------------
const svg03 = frameWrapper(`
  <!-- Viewfinder de cámara oscura -->
  <rect x="15" y="107" width="370" height="470" fill="#0A0A0A"/>
  
  <!-- Cuadro del escáner -->
  <g transform="translate(95, 185)">
    <!-- Marco y esquinas -->
    <rect x="0" y="0" width="210" height="210" rx="14" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    
    <!-- Esquina TL -->
    <path d="M 0 30 L 0 0 L 30 0" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <!-- Esquina TR -->
    <path d="M 180 0 L 210 0 L 210 30" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <!-- Esquina BL -->
    <path d="M 0 180 L 0 210 L 30 210" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <!-- Esquina BR -->
    <path d="M 180 210 L 210 210 L 210 180" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    
    <!-- Simulación de código QR detectado -->
    <rect x="30" y="30" width="150" height="150" fill="#FFFFFF" rx="8"/>
    <g transform="translate(42, 42)">
      <rect x="0" y="0" width="36" height="36" fill="#0F172A"/>
      <rect x="6" y="6" width="24" height="24" fill="#FFFFFF"/>
      <rect x="12" y="12" width="12" height="12" fill="#0F172A"/>

      <rect x="90" y="0" width="36" height="36" fill="#0F172A"/>
      <rect x="96" y="6" width="24" height="24" fill="#FFFFFF"/>
      <rect x="102" y="12" width="12" height="12" fill="#0F172A"/>

      <rect x="0" y="90" width="36" height="36" fill="#0F172A"/>
      <rect x="6" y="96" width="24" height="24" fill="#FFFFFF"/>
      <rect x="12" y="102" width="12" height="12" fill="#0F172A"/>

      <!-- Pixels aleatorios de QR -->
      <rect x="44" y="8" width="8" height="16" fill="#0F172A"/>
      <rect x="58" y="0" width="18" height="8" fill="#0F172A"/>
      <rect x="50" y="44" width="28" height="28" fill="#2563EB"/>
      <text x="64" y="62" fill="#FFFFFF" font-size="10" font-weight="900" text-anchor="middle">IPF</text>
      <rect x="90" y="60" width="16" height="16" fill="#0F172A"/>
      <rect x="44" y="96" width="16" height="20" fill="#0F172A"/>
      <rect x="74" y="90" width="22" height="12" fill="#0F172A"/>
    </g>

    <!-- Línea láser de escaneo -->
    <line x1="10" y1="105" x2="200" y2="105" stroke="#38BDF8" stroke-width="2.5" opacity="0.8"/>
  </g>

  <!-- Badge detector -->
  <rect x="60" y="420" width="280" height="32" rx="16" fill="rgba(0,0,0,0.7)"/>
  <text x="200" y="441" font-size="12" font-weight="600" fill="#38BDF8" text-anchor="middle">✓ QR detectado: "ipf-aula:Laboratorio 2"</text>

  <!-- Notificación emergente de confirmación -->
  <g transform="translate(30, 480)">
    <rect x="0" y="0" width="340" height="80" rx="14" fill="#ECFDF5" stroke="#6EE7B7" filter="url(#shadow)"/>
    <text x="20" y="28" font-size="13" font-weight="800" fill="#065F46">¡Código QR identificado con éxito!</text>
    <text x="20" y="46" font-size="12" fill="#047857">Aula detectada: Laboratorio 2 (PB)</text>
    <rect x="220" y="20" width="105" height="40" rx="8" fill="#059669"/>
    <text x="272" y="44" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Usar aula</text>
  </g>

  <!-- Card inferior manual -->
  <g transform="translate(25, 590)">
    <rect x="0" y="0" width="350" height="130" rx="14" fill="#FFFFFF" stroke="#E2E8F0"/>
    <text x="20" y="26" font-size="12.5" font-weight="700" fill="#334155">¿Problemas con el reflejo de la cámara?</text>
    <rect x="20" y="40" width="220" height="38" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="32" y="64" font-size="12" fill="#0F172A">Laboratorio 2</text>
    <rect x="250" y="40" width="80" height="38" rx="8" fill="#2563EB"/>
    <text x="290" y="64" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">OK</text>
    <text x="20" y="104" font-size="11" fill="#64748B">Estado: CameraView activo | barcodeTypes: ['qr']</text>
  </g>
`, 'Escanear QR del Aula', 'Estado 3: Concedido', true);

// -------------------------------------------------------------
// 4. Escáner - Estado 4: Bloqueado
// -------------------------------------------------------------
const svg04 = frameWrapper(`
  <g transform="translate(25, 125)">
    <!-- Card principal estado bloqueado -->
    <rect x="0" y="0" width="350" height="330" rx="18" fill="#FFFFFF" stroke="#FECACA" filter="url(#shadow)"/>
    
    <circle cx="175" cy="46" r="28" fill="#FEE2E2" stroke="#FCA5A5" stroke-width="2"/>
    <text x="175" y="55" font-size="28" text-anchor="middle">🚫</text>
    
    <text x="175" y="98" font-size="16" font-weight="800" fill="#991B1B" text-anchor="middle">Estado 4: Permiso Bloqueado</text>
    <text x="175" y="118" font-size="12" font-weight="600" fill="#DC2626" text-anchor="middle">status: "denied" | canAskAgain: false</text>
    
    <rect x="20" y="132" width="310" height="74" rx="10" fill="#FEF2F2" stroke="#FCA5A5"/>
    <text x="30" y="152" font-size="11.5" font-weight="700" fill="#991B1B">El sistema operativo no permite volver a preguntar.</text>
    <text x="30" y="168" font-size="11" fill="#B91C1C">Se seleccionó "No permitir" dos veces o se denegó</text>
    <text x="30" y="184" font-size="11" fill="#B91C1C">permanentemente. Requiere habilitación en Ajustes.</text>

    <!-- Botón Abrir Ajustes (reemplaza automáticamente a Continuar) -->
    <rect x="25" y="222" width="300" height="44" rx="12" fill="#DC2626"/>
    <text x="175" y="249" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">Abrir Ajustes</text>

    <text x="175" y="286" font-size="11" font-weight="600" fill="#7F1D1D" text-anchor="middle">Ajustes &gt; Aplicaciones &gt; Mantenimiento IPF &gt; Permisos</text>
    <text x="175" y="304" font-size="10.5" fill="#64748B" text-anchor="middle">Al volver, useRevisarAlVolver refresca sin reiniciar</text>
  </g>

  <!-- Alternativa a mano obligatoria -->
  <g transform="translate(25, 475)">
    <rect x="0" y="0" width="350" height="155" rx="14" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <rect x="20" y="15" width="130" height="20" rx="6" fill="#DCFCE7"/>
    <text x="85" y="29" font-size="10" font-weight="700" fill="#16A34A" text-anchor="middle">LA APP NUNCA SE TRABA</text>
    
    <text x="20" y="55" font-size="13" font-weight="700" fill="#0F172A">Alternativa: Ingresar aula a mano</text>
    <rect x="20" y="68" width="310" height="38" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="32" y="92" font-size="13" font-weight="600" fill="#0F172A">Aula 204 (2° Piso)</text>
    
    <rect x="20" y="114" width="310" height="32" rx="8" fill="#0F172A"/>
    <text x="175" y="135" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Confirmar aula manual</text>
  </g>
`, 'Escanear QR del Aula', 'Estado 4: Bloqueado', true);

// -------------------------------------------------------------
// 5. Ubicación Concedida (Precisión fine vs coarse)
// -------------------------------------------------------------
const svg05 = frameWrapper(`
  <g transform="translate(25, 120)">
    <!-- Banner informativo de ubicación respetuosa -->
    <rect x="0" y="0" width="350" height="74" rx="12" fill="#EFF6FF" stroke="#BFDBFE"/>
    <text x="16" y="24" font-size="18">📍</text>
    <text x="44" y="22" font-size="12" font-weight="700" fill="#1E3A8A">Ubicación respetuosa (Mínimo Privilegio):</text>
    <text x="44" y="38" font-size="10.5" fill="#1D4ED8">Solo solicitamos ubicación en primer plano.</text>
    <text x="44" y="52" font-size="10.5" fill="#1D4ED8">Si elegís aproximada, no guardamos coordenadas exactas.</text>
  </g>

  <!-- Card GPS Concedido -->
  <g transform="translate(25, 206)">
    <rect x="0" y="0" width="350" height="190" rx="14" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <text x="20" y="28" font-size="14" font-weight="700" fill="#0F172A">1. Detección automática por GPS</text>
    <text x="20" y="46" font-size="11" fill="#64748B">Ubicación en uso concedida correctamente.</text>

    <!-- Botón activo de obtención -->
    <rect x="20" y="58" width="310" height="38" rx="10" fill="#2563EB"/>
    <text x="175" y="82" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">📡 Obtener mi ubicación actual</text>

    <!-- Resultado obtenido con matiz de precisión -->
    <rect x="20" y="106" width="310" height="68" rx="10" fill="#F0FDF4" stroke="#86EFAC"/>
    <text x="32" y="126" font-size="12" font-weight="700" fill="#166534">✓ Ubicación registrada con éxito</text>
    <text x="32" y="144" font-size="11" font-weight="600" fill="#15803D">Lat: -26.1852 | Lng: -58.1748 (Precisión GPS)</text>
    <rect x="32" y="152" width="160" height="16" rx="4" fill="#DCFCE7"/>
    <text x="112" y="164" font-size="9.5" font-weight="700" fill="#16A34A" text-anchor="middle">accuracy: fine (Primer plano)</text>
  </g>

  <!-- Selección complementaria de sector -->
  <g transform="translate(25, 410)">
    <rect x="0" y="0" width="350" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <text x="20" y="28" font-size="13" font-weight="700" fill="#0F172A">2. Sector edilicio asociado</text>
    
    <!-- Chips de sectores -->
    <g transform="translate(20, 42)">
      <!-- Patio Central (Activo) -->
      <rect x="0" y="0" width="310" height="32" rx="8" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.5"/>
      <text x="16" y="20" font-size="12" font-weight="700" fill="#1D4ED8">✓ Patio Central (Cerca del mástil)</text>

      <rect x="0" y="38" width="310" height="32" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="58" font-size="12" fill="#334155">Estacionamiento Principal</text>

      <rect x="0" y="76" width="310" height="32" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="96" font-size="12" fill="#334155">Pasillo Planta Baja (Aulas 101-110)</text>

      <rect x="0" y="114" width="310" height="32" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="134" font-size="12" fill="#334155">Biblioteca / Sala de Estudio</text>
    </g>

    <!-- Botón de Confirmación -->
    <rect x="20" y="196" width="310" height="36" rx="10" fill="#0F172A"/>
    <text x="175" y="219" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Confirmar Ubicación / Sector</text>
  </g>
`, 'Marcar Ubicación', 'Ubicación Concedida (Fine/Coarse)', true);

// -------------------------------------------------------------
// 6. Ubicación Denegada (Camino Alternativo)
// -------------------------------------------------------------
const svg06 = frameWrapper(`
  <g transform="translate(25, 120)">
    <!-- Banner de aviso denegado -->
    <rect x="0" y="0" width="350" height="66" rx="12" fill="#FEF3C7" stroke="#FCD34D"/>
    <text x="16" y="24" font-size="18">📍</text>
    <text x="44" y="22" font-size="12" font-weight="700" fill="#92400E">Ubicación denegada en el dispositivo:</text>
    <text x="44" y="38" font-size="11" fill="#B45309">No te preocupes: podés seleccionar el sector a mano.</text>
    <text x="44" y="52" font-size="11" fill="#B45309">La app no se detiene ni exige habilitar el GPS.</text>
  </g>

  <!-- Card GPS saltado -->
  <g transform="translate(25, 198)">
    <rect x="0" y="0" width="350" height="70" rx="12" fill="#FFFFFF" stroke="#E2E8F0"/>
    <text x="20" y="26" font-size="12" font-weight="700" fill="#64748B">1. Detección GPS: Omitida</text>
    <text x="20" y="44" font-size="11" fill="#94A3B8">Permiso omitido o denegado por el usuario.</text>
    <rect x="240" y="20" width="90" height="28" rx="6" fill="#F1F5F9"/>
    <text x="285" y="38" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">Denegado</text>
  </g>

  <!-- Camino alternativo: Sector a mano -->
  <g transform="translate(25, 280)">
    <rect x="0" y="0" width="350" height="370" rx="16" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <rect x="20" y="16" width="120" height="20" rx="6" fill="#ECFDF5"/>
    <text x="80" y="30" font-size="10" font-weight="700" fill="#059669" text-anchor="middle">CAMINO ALTERNATIVO</text>

    <text x="20" y="56" font-size="14" font-weight="800" fill="#0F172A">Elegir sector del edificio a mano</text>
    <text x="20" y="74" font-size="11.5" fill="#64748B">Tocá el sector donde ocurrió el desperfecto:</text>

    <g transform="translate(20, 88)">
      <!-- Patio Central -->
      <rect x="0" y="0" width="310" height="34" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="22" font-size="12" fill="#334155">Patio Central</text>

      <!-- Estacionamiento Principal -->
      <rect x="0" y="40" width="310" height="34" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="62" font-size="12" fill="#334155">Estacionamiento Principal</text>

      <!-- Pasillo PB (SELECCIONADO) -->
      <rect x="0" y="80" width="310" height="34" rx="8" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.8"/>
      <text x="16" y="102" font-size="12" font-weight="700" fill="#1D4ED8">✓ Pasillo Planta Baja (Aulas 101-110)</text>

      <!-- Biblioteca -->
      <rect x="0" y="120" width="310" height="34" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="142" font-size="12" fill="#334155">Biblioteca / Sala de Estudio</text>

      <!-- Comedor -->
      <rect x="0" y="160" width="310" height="34" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="182" font-size="12" fill="#334155">Comedor / Cantina</text>

      <!-- Gimnasio -->
      <rect x="0" y="200" width="310" height="34" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
      <text x="16" y="222" font-size="12" fill="#334155">Gimnasio / Campo de Deportes</text>
    </g>

    <!-- Botón Confirmar Selección Manual -->
    <rect x="20" y="328" width="310" height="36" rx="10" fill="#0F172A"/>
    <text x="175" y="351" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Confirmar Sector Seleccionado</text>
  </g>
`, 'Marcar Ubicación', 'Ubicación Denegada (Alternativa Manual)', true);

// -------------------------------------------------------------
// 7. Foto desde el Selector (Mínimo Privilegio - 0 permisos)
// -------------------------------------------------------------
const svg07 = frameWrapper(`
  <g transform="translate(25, 120)">
    <!-- Banner explicativo Mínimo Privilegio -->
    <rect x="0" y="0" width="350" height="68" rx="12" fill="#ECFDF5" stroke="#A7F3D0"/>
    <text x="16" y="24" font-size="18">🛡️</text>
    <text x="44" y="22" font-size="12" font-weight="700" fill="#065F46">Mínimo privilegio en fotos (Cero permisos):</text>
    <text x="44" y="38" font-size="11" fill="#047857">"Elegir de la galería" usa el Photo Picker del SO.</text>
    <text x="44" y="52" font-size="11" fill="#047857">No requiere READ_MEDIA_IMAGES ni acceso a tus fotos.</text>
  </g>

  <!-- Preview de imagen seleccionada con el Photo Picker -->
  <g transform="translate(25, 200)">
    <rect x="0" y="0" width="350" height="330" rx="16" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    
    <!-- Imagen del desperfecto (Luminaria rota) -->
    <rect x="15" y="15" width="320" height="190" rx="12" fill="#1E293B"/>
    <!-- Ilustración de foco / luminaria -->
    <circle cx="175" cy="90" r="34" fill="#F59E0B" opacity="0.3"/>
    <circle cx="175" cy="90" r="22" fill="#FCD34D"/>
    <path d="M 165 112 L 185 112 L 180 124 L 170 124 Z" fill="#94A3B8"/>
    <!-- Grieta en el foco -->
    <path d="M 170 80 L 175 92 L 172 102" stroke="#DC2626" stroke-width="2.5" fill="none"/>
    <text x="175" y="160" fill="#FFFFFF" font-size="12" font-weight="600" text-anchor="middle">Luminaria quemada - Aula 102</text>
    
    <!-- Metadatos de la foto -->
    <g transform="translate(15, 218)">
      <rect x="0" y="0" width="200" height="24" rx="6" fill="#F1F5F9"/>
      <text x="100" y="16" font-size="10.5" font-weight="700" fill="#475569" text-anchor="middle">🖼️ Selector nativo (0 permisos)</text>
      
      <text x="280" y="16" font-size="11" font-weight="600" fill="#DC2626" text-anchor="middle">Cambiar</text>
    </g>

    <rect x="15" y="258" width="320" height="42" rx="10" fill="#2563EB"/>
    <text x="175" y="284" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Usar esta foto en el reporte</text>
  </g>

  <!-- Opciones de captura -->
  <g transform="translate(25, 545)">
    <rect x="0" y="0" width="350" height="120" rx="14" fill="#FFFFFF" stroke="#E2E8F0"/>
    <g transform="translate(16, 16)">
      <circle cx="18" cy="18" r="18" fill="#F1F5F9"/>
      <text x="18" y="24" font-size="16" text-anchor="middle">🖼️</text>
      <text x="46" y="16" font-size="13" font-weight="700" fill="#0F172A">Elegir de la galería (Recomendado)</text>
      <text x="46" y="32" font-size="11" fill="#64748B">Photo Picker oficial. Seguro, aislado y sin permisos.</text>
    </g>
    <line x1="16" y1="62" x2="334" y2="62" stroke="#F1F5F9"/>
    <g transform="translate(16, 72)">
      <circle cx="18" cy="18" r="18" fill="#EFF6FF"/>
      <text x="18" y="24" font-size="16" text-anchor="middle">📷</text>
      <text x="46" y="16" font-size="13" font-weight="700" fill="#0F172A">Sacar foto en el momento</text>
      <text x="46" y="32" font-size="11" fill="#64748B">Utiliza el sensor de la cámara (requiere permiso).</text>
    </g>
  </g>
`, 'Adjuntar Fotografía', 'Selector Nativo (Cero Permisos)', true);

// -------------------------------------------------------------
// 8. Notificaciones en Contexto (/ajustes-app)
// -------------------------------------------------------------
const svg08 = frameWrapper(`
  <g transform="translate(25, 120)">
    <!-- Card Interruptor principal -->
    <rect x="0" y="0" width="350" height="110" rx="16" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <g transform="translate(20, 20)">
      <text x="0" y="16" font-size="14.5" font-weight="800" fill="#0F172A">Avisarme al resolver mi reporte</text>
      <text x="0" y="36" font-size="11" fill="#64748B">Recibí una alerta apenas el equipo técnico</text>
      <text x="0" y="50" font-size="11" fill="#64748B">solucione el desperfecto informado.</text>

      <!-- Switch Activo (ON) -->
      <g transform="translate(250, 10)">
        <rect x="0" y="0" width="50" height="28" rx="14" fill="#2563EB"/>
        <circle cx="36" cy="14" r="11" fill="#FFFFFF"/>
      </g>
    </g>
  </g>

  <!-- Estado del sistema operativo -->
  <g transform="translate(25, 245)">
    <rect x="0" y="0" width="350" height="210" rx="16" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <text x="20" y="28" font-size="13.5" font-weight="700" fill="#0F172A">Estado del sistema operativo</text>

    <g transform="translate(20, 46)">
      <text x="0" y="16" font-size="12" fill="#334155">Permiso de notificaciones:</text>
      <rect x="220" y="0" width="90" height="24" rx="6" fill="#DCFCE7"/>
      <text x="265" y="16" font-size="11" font-weight="700" fill="#16A34A" text-anchor="middle">✓ Concedido</text>
    </g>

    <rect x="20" y="86" width="310" height="42" rx="8" fill="#F1F5F9"/>
    <text x="32" y="104" font-size="11" fill="#475569">• Canal de Android: <tspan font-weight="700" fill="#1E3A8A">"reportes"</tspan></text>
    <text x="32" y="118" font-size="10.5" fill="#64748B">(Alta prioridad con sonido y vibración configurados)</text>

    <rect x="20" y="142" width="310" height="40" rx="10" fill="#EFF6FF" stroke="#BFDBFE"/>
    <text x="175" y="167" font-size="12.5" font-weight="700" fill="#2563EB" text-anchor="middle">🚀 Enviar notificación de prueba (2s)</text>
  </g>

  <!-- Principio de Pedir en Contexto -->
  <g transform="translate(25, 470)">
    <rect x="0" y="0" width="350" height="150" rx="14" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="18" y="24" font-size="12.5" font-weight="700" fill="#1E3A8A">📖 Principio de "Pedir en contexto":</text>
    <text x="18" y="44" font-size="11" fill="#475569">La app no solicita notificaciones al inicio. Únicamente</text>
    <text x="18" y="58" font-size="11" fill="#475569">las pide cuando activás este interruptor sabiendo</text>
    <text x="18" y="72" font-size="11" fill="#475569">exactamente qué beneficio recibirás.</text>
    
    <text x="18" y="98" font-size="11" fill="#475569">Si las denegás, la alerta se entrega sin problemas</text>
    <text x="18" y="112" font-size="11" fill="#475569">en la pestaña interna <tspan font-weight="700" fill="#1E3A8A">/avisos</tspan>.</text>
  </g>
`, 'Ajustes de la App', 'Notificaciones en Contexto', true);

// -------------------------------------------------------------
// 9. Notificación Recibida en el Dispositivo
// -------------------------------------------------------------
const svg09 = frameWrapper(`
  <!-- Fondo de pantalla de bloqueo / escritorio -->
  <rect x="15" y="107" width="370" height="680" fill="#1E293B"/>
  
  <!-- Reloj de pantalla de bloqueo -->
  <text x="200" y="220" font-size="64" font-weight="200" fill="#FFFFFF" text-anchor="middle">09:42</text>
  <text x="200" y="248" font-size="14" font-weight="500" fill="#CBD5E1" text-anchor="middle">Viernes, 30 de Octubre</text>

  <!-- Banner de notificación push/local del sistema Android / iOS -->
  <g transform="translate(25, 290)">
    <rect x="0" y="0" width="350" height="120" rx="20" fill="rgba(255, 255, 255, 0.92)" filter="url(#modalShadow)"/>
    
    <!-- Header de la notificación -->
    <rect x="16" y="16" width="24" height="24" rx="6" fill="#1E3A8A"/>
    <text x="28" y="32" font-size="12" fill="#FFFFFF" text-anchor="middle">🛠️</text>
    <text x="48" y="30" font-size="12" font-weight="700" fill="#0F172A">Mantenimiento IPF</text>
    <text x="175" y="30" font-size="11" fill="#64748B">• ahora</text>
    <text x="315" y="30" font-size="12" fill="#64748B">🔔</text>

    <!-- Contenido del aviso programado (G2.5) -->
    <text x="16" y="60" font-size="13.5" font-weight="800" fill="#1E3A8A">Reporte #rep-1042 resuelto</text>
    <text x="16" y="78" font-size="12" fill="#334155">El desperfecto "Luminaria Aula 102" fue reparado.</text>

    <!-- Acciones directas de la notificación -->
    <g transform="translate(16, 92)">
      <rect x="0" y="0" width="105" height="20" rx="6" fill="#EFF6FF"/>
      <text x="52" y="14" font-size="10" font-weight="700" fill="#2563EB" text-anchor="middle">Ver en la app</text>
      
      <rect x="115" y="0" width="80" height="20" rx="6" fill="#F1F5F9"/>
      <text x="155" y="14" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">Descartar</text>
    </g>
  </g>

  <!-- Banner informativo abajo -->
  <g transform="translate(25, 460)">
    <rect x="0" y="0" width="350" height="100" rx="14" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255,255,255,0.15)"/>
    <text x="20" y="28" font-size="12" font-weight="700" fill="#38BDF8">Canal nativo "reportes" activado:</text>
    <text x="20" y="46" font-size="11" fill="#E2E8F0">Generada tras 10s mediante:</text>
    <text x="20" y="62" font-size="10" font-family="monospace" fill="#93C5FD">Notifications.scheduleNotificationAsync()</text>
    <text x="20" y="80" font-size="10.5" fill="#CBD5E1">Si estuviese bloqueado, se recibiría en /avisos.</text>
  </g>
`, 'Notificación Recibida', 'Simulación de Resolución a 10s', true);

// -------------------------------------------------------------
// 10. Panel de Permisos - ANTES de Ajustes
// -------------------------------------------------------------
const svg10 = frameWrapper(`
  <!-- Banner Plataforma -->
  <g transform="translate(25, 118)">
    <rect x="0" y="0" width="350" height="42" rx="10" fill="#FFFFFF" stroke="#E2E8F0"/>
    <rect x="10" y="10" width="90" height="22" rx="6" fill="#1E3A8A"/>
    <text x="55" y="25" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">SO: ANDROID</text>
    <text x="110" y="26" font-size="11" fill="#475569">Estado pasivo inicial de los permisos</text>
  </g>

  <!-- Lista de permisos ANTES -->
  <g transform="translate(25, 170)">
    <!-- 1. Cámara -->
    <rect x="0" y="0" width="350" height="98" rx="12" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
    <text x="16" y="24" font-size="18">📷</text>
    <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Cámara</text>
    <text x="44" y="36" font-size="10" fill="#64748B">expo-camera (sin micrófono)</text>
    <rect x="235" y="12" width="100" height="22" rx="6" fill="#FEF3C7"/>
    <text x="285" y="27" font-size="10.5" font-weight="700" fill="#D97706" text-anchor="middle">Preguntable</text>
    <text x="16" y="58" font-size="10.5" font-style="italic" fill="#475569">"Usamos tu cámara para escanear el QR..."</text>
    <rect x="16" y="68" width="318" height="22" rx="6" fill="#EFF6FF"/>
    <text x="175" y="83" font-size="10.5" font-weight="700" fill="#2563EB" text-anchor="middle">Ver Pantalla Previa</text>

    <!-- 2. Ubicación -->
    <g transform="translate(0, 108)">
      <rect x="0" y="0" width="350" height="98" rx="12" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
      <text x="16" y="24" font-size="18">📍</text>
      <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Ubicación</text>
      <text x="44" y="36" font-size="10" fill="#64748B">expo-location (primer plano)</text>
      <rect x="235" y="12" width="100" height="22" rx="6" fill="#FEF3C7"/>
      <text x="285" y="27" font-size="10.5" font-weight="700" fill="#D97706" text-anchor="middle">Preguntable</text>
      <text x="16" y="58" font-size="10.5" font-style="italic" fill="#475569">"Usamos tu ubicación para identificar sector..."</text>
      <rect x="16" y="68" width="318" height="22" rx="6" fill="#EFF6FF"/>
      <text x="175" y="83" font-size="10.5" font-weight="700" fill="#2563EB" text-anchor="middle">Ver Pantalla Previa</text>
    </g>

    <!-- 3. Notificaciones -->
    <g transform="translate(0, 216)">
      <rect x="0" y="0" width="350" height="98" rx="12" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
      <text x="16" y="24" font-size="18">🔔</text>
      <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Notificaciones</text>
      <text x="44" y="36" font-size="10" fill="#64748B">expo-notifications</text>
      <rect x="235" y="12" width="100" height="22" rx="6" fill="#FEF3C7"/>
      <text x="285" y="27" font-size="10.5" font-weight="700" fill="#D97706" text-anchor="middle">Preguntable</text>
      <text x="16" y="58" font-size="10.5" font-style="italic" fill="#475569">"Usamos notificaciones para avisarte resolución..."</text>
      <rect x="16" y="68" width="318" height="22" rx="6" fill="#EFF6FF"/>
      <text x="175" y="83" font-size="10.5" font-weight="700" fill="#2563EB" text-anchor="middle">Ver Pantalla Previa</text>
    </g>

    <!-- 4. Galería (Photo Picker) -->
    <g transform="translate(0, 324)">
      <rect x="0" y="0" width="350" height="88" rx="12" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#shadow)"/>
      <text x="16" y="24" font-size="18">🖼️</text>
      <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Galería de fotos</text>
      <text x="44" y="36" font-size="10" fill="#64748B">expo-image-picker</text>
      <rect x="235" y="12" width="100" height="22" rx="6" fill="#DCFCE7"/>
      <text x="285" y="27" font-size="10.5" font-weight="700" fill="#16A34A" text-anchor="middle">✓ Otorgado</text>
      <text x="16" y="58" font-size="10.5" font-weight="600" fill="#059669">Acceso: Photo Picker del SO (0 permisos declarados)</text>
      <rect x="16" y="66" width="160" height="16" rx="4" fill="#ECFDF5"/>
      <text x="96" y="78" font-size="9" font-weight="700" fill="#059669" text-anchor="middle">MÍNIMO PRIVILEGIO</text>
    </g>
  </g>
`, 'Panel de Permisos', 'Antes de Ajustes (Pasivo inicial)', false, 'permisos');

// -------------------------------------------------------------
// 11. Panel de Permisos - DESPUÉS de Ajustes (AppState Refrescado)
// -------------------------------------------------------------
const svg11 = frameWrapper(`
  <!-- Banner Plataforma con badge de sincronización -->
  <g transform="translate(25, 118)">
    <rect x="0" y="0" width="350" height="42" rx="10" fill="#ECFDF5" stroke="#A7F3D0"/>
    <rect x="10" y="10" width="90" height="22" rx="6" fill="#059669"/>
    <text x="55" y="25" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">SO: ANDROID</text>
    <text x="110" y="26" font-size="11" font-weight="700" fill="#065F46">Sincronizado vía AppState al volver</text>
  </g>

  <!-- Lista de permisos DESPUÉS -->
  <g transform="translate(25, 170)">
    <!-- 1. Cámara: CONCEDIDO -->
    <rect x="0" y="0" width="350" height="98" rx="12" fill="#FFFFFF" stroke="#86EFAC" filter="url(#shadow)"/>
    <text x="16" y="24" font-size="18">📷</text>
    <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Cámara</text>
    <text x="44" y="36" font-size="10" fill="#64748B">Habilitado desde Ajustes del sistema</text>
    <rect x="235" y="12" width="100" height="22" rx="6" fill="#DCFCE7"/>
    <text x="285" y="27" font-size="10.5" font-weight="700" fill="#16A34A" text-anchor="middle">✓ Concedido</text>
    <text x="16" y="58" font-size="10.5" fill="#166534">Permiso concedido para QR y fotos.</text>
    <rect x="16" y="68" width="318" height="22" rx="6" fill="#059669"/>
    <text x="175" y="83" font-size="10.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Otorgado</text>

    <!-- 2. Ubicación: PARCIAL (Aproximada) -->
    <g transform="translate(0, 108)">
      <rect x="0" y="0" width="350" height="106" rx="12" fill="#FFFFFF" stroke="#DDD6FE" filter="url(#shadow)"/>
      <text x="16" y="24" font-size="18">📍</text>
      <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Ubicación</text>
      <text x="44" y="36" font-size="10" fill="#64748B">Usuario seleccionó "Aproximada"</text>
      <rect x="180" y="12" width="75" height="22" rx="6" fill="#DCFCE7"/>
      <text x="217" y="27" font-size="10" font-weight="700" fill="#16A34A" text-anchor="middle">Concedido</text>
      <rect x="260" y="12" width="75" height="22" rx="6" fill="#EDE9FE"/>
      <text x="297" y="27" font-size="10" font-weight="700" fill="#7C3AED" text-anchor="middle">Parcial</text>
      <text x="16" y="58" font-size="10" font-weight="700" fill="#7C3AED">Matiz GPS: Aproximada (accuracy: "coarse")</text>
      <text x="16" y="72" font-size="9.5" fill="#64748B">La app respeta la privacidad sin coordenadas exactas.</text>
      <rect x="16" y="80" width="318" height="20" rx="6" fill="#059669"/>
      <text x="175" y="94" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Otorgado</text>
    </g>

    <!-- 3. Notificaciones: CONCEDIDO -->
    <g transform="translate(0, 224)">
      <rect x="0" y="0" width="350" height="98" rx="12" fill="#FFFFFF" stroke="#86EFAC" filter="url(#shadow)"/>
      <text x="16" y="24" font-size="18">🔔</text>
      <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Notificaciones</text>
      <text x="44" y="36" font-size="10" fill="#64748B">Canal "reportes" activo</text>
      <rect x="235" y="12" width="100" height="22" rx="6" fill="#DCFCE7"/>
      <text x="285" y="27" font-size="10.5" font-weight="700" fill="#16A34A" text-anchor="middle">✓ Concedido</text>
      <text x="16" y="58" font-size="10.5" fill="#166534">Avisos locales activados con éxito.</text>
      <rect x="16" y="68" width="318" height="22" rx="6" fill="#059669"/>
      <text x="175" y="83" font-size="10.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Otorgado</text>
    </g>

    <!-- 4. Galería: Photo Picker 0 permisos -->
    <g transform="translate(0, 332)">
      <rect x="0" y="0" width="350" height="84" rx="12" fill="#FFFFFF" stroke="#E2E8F0"/>
      <text x="16" y="24" font-size="18">🖼️</text>
      <text x="44" y="22" font-size="13" font-weight="700" fill="#0F172A">Galería de fotos</text>
      <rect x="235" y="12" width="100" height="22" rx="6" fill="#DCFCE7"/>
      <text x="285" y="27" font-size="10.5" font-weight="700" fill="#16A34A" text-anchor="middle">✓ Otorgado</text>
      <text x="16" y="56" font-size="10.5" font-weight="600" fill="#059669">Acceso: Photo Picker del SO (0 permisos declarados)</text>
    </g>
  </g>
`, 'Panel de Permisos', 'Después de Volver de Ajustes (Refresco reactivo)', false, 'permisos');

// -------------------------------------------------------------
// 12. Diálogo Nativo del Sistema en Development Build
// -------------------------------------------------------------
const svg12 = frameWrapper(`
  <!-- Pantalla atenuada de fondo (Backdrop) -->
  <rect x="15" y="107" width="370" height="680" fill="rgba(15, 23, 42, 0.65)"/>

  <!-- Diálogo nativo de Android 14/15 con texto de propósito propio -->
  <g transform="translate(35, 250)">
    <rect x="0" y="0" width="330" height="320" rx="28" fill="#F3EDF7" filter="url(#modalShadow)"/>

    <!-- Ícono de la cámara de Android -->
    <g transform="translate(145, 24)">
      <circle cx="20" cy="20" r="22" fill="#E8DEF8"/>
      <text x="20" y="26" font-size="20" text-anchor="middle">📷</text>
    </g>

    <!-- Título oficial del sistema -->
    <text x="165" y="88" font-size="15" font-weight="700" fill="#1D1B20" text-anchor="middle">¿Permitir que Mantenimiento IPF</text>
    <text x="165" y="106" font-size="15" font-weight="700" fill="#1D1B20" text-anchor="middle">tome fotos y grabe videos?</text>

    <!-- TEXTO DE PROPÓSITO PROPIO (Demuestra app.json compilado en Development Build) -->
    <rect x="20" y="122" width="290" height="58" rx="12" fill="#E8DEF8" stroke="#D0BCFF"/>
    <text x="30" y="142" font-size="11" font-weight="700" fill="#21005D">Texto configurado en app.json:</text>
    <text x="30" y="158" font-size="10.5" font-style="italic" fill="#381E72">"Usamos tu cámara para escanear el código QR</text>
    <text x="30" y="171" font-size="10.5" font-style="italic" fill="#381E72">del aula y tomar fotos del desperfecto edilicio."</text>

    <!-- Botones oficiales del sistema Android -->
    <!-- Opción 1: Mientras la app está en uso -->
    <rect x="20" y="194" width="290" height="34" rx="17" fill="#6750A4"/>
    <text x="165" y="216" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Mientras la app está en uso</text>

    <!-- Opción 2: Solo esta vez -->
    <rect x="20" y="234" width="290" height="34" rx="17" fill="#FFFFFF" stroke="#CAC4D0"/>
    <text x="165" y="256" font-size="12.5" font-weight="600" fill="#1D1B20" text-anchor="middle">Solo esta vez</text>

    <!-- Opción 3: No permitir -->
    <rect x="20" y="274" width="290" height="34" rx="17" fill="#FFFFFF" stroke="#CAC4D0"/>
    <text x="165" y="296" font-size="12.5" font-weight="600" fill="#1D1B20" text-anchor="middle">No permitir</text>
  </g>

  <!-- Tag de aclaración técnica -->
  <g transform="translate(25, 595)">
    <rect x="0" y="0" width="350" height="85" rx="14" fill="#0F172A" stroke="rgba(255,255,255,0.2)"/>
    <text x="20" y="26" font-size="12" font-weight="700" fill="#38BDF8">Requisito G5.4 — Diálogo del sistema en Dev Build:</text>
    <text x="20" y="44" font-size="11" fill="#E2E8F0">• Demuestra la lectura de NSCameraUsageDescription y el</text>
    <text x="20" y="58" font-size="11" fill="#E2E8F0">  plugin expo-camera en un binario compilado (no Expo Go).</text>
    <text x="20" y="74" font-size="10.5" font-weight="600" fill="#93C5FD">Mínimo privilegio: microphonePermission: false</text>
  </g>
`, 'Development Build', 'Diálogo Nativo del Sistema', false);

const capturas = [
  { name: '01-escaner-cargando.svg', content: svg01 },
  { name: '02-escaner-preguntable.svg', content: svg02 },
  { name: '03-escaner-concedido.svg', content: svg03 },
  { name: '04-escaner-bloqueado.svg', content: svg04 },
  { name: '05-ubicacion-concedida.svg', content: svg05 },
  { name: '06-ubicacion-denegada.svg', content: svg06 },
  { name: '07-foto-selector.svg', content: svg07 },
  { name: '08-notificaciones-ajustes.svg', content: svg08 },
  { name: '09-notificacion-recibida.svg', content: svg09 },
  { name: '10-panel-permisos-antes.svg', content: svg10 },
  { name: '11-panel-permisos-despues.svg', content: svg11 },
  { name: '12-dialogo-sistema-devbuild.svg', content: svg12 },
];

for (const c of capturas) {
  const filePath = path.join(outputDir, c.name);
  fs.writeFileSync(filePath, c.content, 'utf8');
  console.log(`Generado: ${c.name}`);
}

console.log('¡12 capturas SVG generadas con éxito en assets/capturas/!');
