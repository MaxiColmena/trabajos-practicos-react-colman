import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  pantalla: {
    padding: 16,
    gap: 12,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
  },

  texto: {
    fontSize: 16,
  },

  tarjeta: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
    gap: 4,
  },

  boton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  botonOff: {
    backgroundColor: '#94a3b8',
  },

  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },

  chipActivo: {
    backgroundColor: '#2563eb',
  },

  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  error: {
    color: '#dc2626',
  },

  debug: {
    marginTop: 24,
    padding: 8,
    backgroundColor: '#fef9c3',
    borderRadius: 8,
  },
});