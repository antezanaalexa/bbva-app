import api from './svc_api.js'

export const bbvaCoreService = {
  getKpis: async () => {
    const res = await api.get('/core/dashboard/kpis')
    return res.data
  },

  getSolicitudes: async () => {
    const res = await api.get('/core/solicitudes')
    return res.data
  },

  getSolicitudById: async (id) => {
    const res = await api.get(`/core/solicitudes/${id}`)
    return res.data
  },

  aprobar: async (id) => {
    const res = await api.post(`/core/solicitudes/${id}/aprobar`)
    return res.data
  },

  rechazar: async (id) => {
    const res = await api.post(`/core/solicitudes/${id}/rechazar`)
    return res.data
  },

  desembolsar: async (id) => {
    const res = await api.post(`/core/solicitudes/${id}/desembolsar`)
    return res.data
  }
}
