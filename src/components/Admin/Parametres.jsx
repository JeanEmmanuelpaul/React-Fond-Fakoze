import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from './common/AdminLayout'

const menuItems = [
  // ── Gestion des utilisateurs ──
  {
    label: 'Utilisateurs',
    color: '#E6F1FB', stroke: '#185FA5',
    path: '/admin/users',
    category: 'Gestion des membres',
    icon: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>
  },
  {
    label: 'Rôles & accès',
    color: '#EEEDFE', stroke: '#534AB7',
    path: '/admin/roles',
    category: 'Gestion des membres',
    icon: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
  },
  {
    label: 'Bénévoles',
    color: '#E1F5EE', stroke: '#0F6E56',
    path: '/admin/benevoles',
    category: 'Gestion des membres',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>
  },
  {
    label: 'Adhésions',
    color: '#FAEEDA', stroke: '#854F0B',
    path: '/admin/adhesions',
    category: 'Gestion des membres',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></>
  },

  // ── Contenu ──
  {
    label: 'Articles',
    color: '#EEEDFE', stroke: '#534AB7',
    path: '/admin/ArticleList',
    category: 'Contenu',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>
  },
  {
    label: 'Ajouter article',
    color: '#EAF3DE', stroke: '#3B6D11',
    path: '/Admin/Actualitead',
    category: 'Contenu',
    icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><line x1="16" y1="5" x2="22" y2="5"/><line x1="19" y1="2" x2="19" y2="8"/></>
  },
  {
    label: 'Galerie photos',
    color: '#FAEEDA', stroke: '#854F0B',
    path: '/admin/galeries',
    category: 'Contenu',
    icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>
  },
  {
    label: 'Photo banner',
    color: '#FAEEDA', stroke: '#854F0B',
    path: '/admin/banner',
    category: 'Contenu',
    icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/><line x1="16" y1="7" x2="22" y2="7"/><line x1="19" y1="4" x2="19" y2="10"/></>
  },
  {
    label: 'Vidéos',
    color: '#E6F1FB', stroke: '#185FA5',
    path: '/admin/videos',
    category: 'Contenu',
    icon: <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>
  },
  {
    label: 'Documents',
    color: '#F1EFE8', stroke: '#5F5E5A',
    path: '/admin/documents',
    category: 'Contenu',
    icon: <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></>
  },

  // ── Événements ──
  {
    label: 'Événements',
    color: '#FAECE7', stroke: '#993C1D',
    path: '/Admin/EventList',
    category: 'Événements',
    icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>
  },
  {
    label: 'Ajouter événement',
    color: '#E1F5EE', stroke: '#0F6E56',
    path: '/Admin/AddEvenement',
    category: 'Événements',
    icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="15" x2="12" y2="19"/><line x1="10" y1="17" x2="14" y2="17"/></>
  },
  {
    label: 'Inscriptions',
    color: '#FBEAF0', stroke: '#993556',
    path: '/admin/inscriptions',
    category: 'Événements',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></>
  },
  {
    label: 'Calendrier',
    color: '#E6F1FB', stroke: '#185FA5',
    path: '/admin/calendrier',
    category: 'Événements',
    icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="2"/></>
  },

  // ── Finances & Dons ──
  {
    label: 'Espace de don',
    color: '#FBEAF0', stroke: '#993556',
    path: '/admin/dons',
    category: 'Finances & Dons',
    icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  },
  {
    label: 'Transactions',
    color: '#EAF3DE', stroke: '#3B6D11',
    path: '/admin/transactions',
    category: 'Finances & Dons',
    icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>
  },
  {
    label: 'Rapports financiers',
    color: '#FAEEDA', stroke: '#854F0B',
    path: '/admin/rapports',
    category: 'Finances & Dons',
    icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>
  },
  {
    label: 'Budget',
    color: '#E1F5EE', stroke: '#0F6E56',
    path: '/admin/budget',
    category: 'Finances & Dons',
    icon: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>
  },

  // ── Communication ──
  {
    label: 'Messages',
    color: '#E6F1FB', stroke: '#185FA5',
    path: '/admin/messages',
    category: 'Communication',
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>
  },
  {
    label: 'Notifications',
    color: '#FAEEDA', stroke: '#854F0B',
    path: '/admin/notifications',
    category: 'Communication',
    icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>
  },
  {
    label: 'Newsletter',
    color: '#EEEDFE', stroke: '#534AB7',
    path: '/admin/newsletter',
    category: 'Communication',
    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>
  },
  {
    label: 'Annonces',
    color: '#FAECE7', stroke: '#993C1D',
    path: '/admin/annonces',
    category: 'Communication',
    icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>
  },

  // ── Statistiques ──
  {
    label: 'Statistiques',
    color: '#E1F5EE', stroke: '#0F6E56',
    path: '/admin/stats',
    category: 'Rapports & Stats',
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  },
  {
    label: 'Rapports',
    color: '#EEEDFE', stroke: '#534AB7',
    path: '/admin/rapports-activite',
    category: 'Rapports & Stats',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>
  },
  {
    label: 'Activité',
    color: '#FAECE7', stroke: '#993C1D',
    path: '/admin/activite',
    category: 'Rapports & Stats',
    icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>
  },

  // ── Système ──
  {
    label: 'Paramètres',
    color: '#F1EFE8', stroke: '#5F5E5A',
    path: '/admin/settings',
    category: 'Système',
    icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>
  },
  {
    label: 'Sauvegardes',
    color: '#E1F5EE', stroke: '#0F6E56',
    path: '/admin/backups',
    category: 'Système',
    icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>
  },
  {
    label: 'Déconnexion',
    color: '#FCEBEB', stroke: '#A32D2D',
    path: null,
    isLogout: true,
    category: 'Système',
    icon: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>
  },
]

const categories = [...new Set(menuItems.map(i => i.category))]

const Parametres = () => {
  const navigate = useNavigate()

  const handleClick = (item) => {
    if (item.isLogout) {
      // votre logique de déconnexion ici
      navigate('/login')
      return
    }
    navigate(item.path)
  }

  return (
    <AdminLayout>
      <div className='kddkd py-4'></div>
      <div className="container-fluid py-5 px-4">

        {/* En-tête */}
        <div className="mb-4 pb-2 border-bottom">
          <h4 className="fw-bold mb-1">Paramètres</h4>
          <p className="text-muted small mb-0">
            Gérez toutes les sections de votre organisation.
          </p>
        </div>

        {/* Sections groupées */}
        {categories.map((cat) => (
          <div className="mb-5" key={cat}>
            {/* Titre de catégorie */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="fw-semibold text-uppercase"
                style={{ fontSize: 11, letterSpacing: '0.08em', color: '#888' }}
              >
                {cat}
              </span>
              <div className="flex-grow-1 border-bottom" style={{ opacity: 0.3 }} />
            </div>

            {/* Grille */}
            <div className="row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 g-3">
              {menuItems
                .filter(item => item.category === cat)
                .map((item, i) => (
                  <div className="col" key={i}>
                    <div
                      className="d-flex flex-column align-items-center gap-2 p-3 rounded-3 border bg-white"
                      style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                      onClick={() => handleClick(item)}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#f8f9fa'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.07)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {/* Cercle icône */}
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 50, height: 50, background: item.color, flexShrink: 0 }}
                      >
                        <svg
                          width="24" height="24" viewBox="0 0 24 24"
                          fill="none" stroke={item.stroke}
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        >
                          {item.icon}
                        </svg>
                      </div>
                      {/* Label */}
                      <span
                        className="text-center fw-semibold"
                        style={{
                          fontSize: 11,
                          lineHeight: 1.3,
                          color: item.isLogout ? '#A32D2D' : '#444',
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

      </div>
    </AdminLayout>
  )
}

export default Parametres