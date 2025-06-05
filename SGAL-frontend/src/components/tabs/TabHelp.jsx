import React, { useState } from 'react';
import { HelpCircle, BookOpen, Code, Info, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const TabHelp = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "¿Cómo actualizo el software?",
      answer: "Las actualizaciones se descargan automáticamente cuando están disponibles. Puedes verificar manualmente en Configuración > Avanzado > Buscar actualizaciones."
    },
    {
      id: 2,
      question: "¿Dónde encuentro mis reportes generados?",
      answer: "Todos los reportes se guardan en la sección 'Documentos' y puedes exportarlos en formatos PDF, CSV o Excel."
    },
    {
      id: 3,
      question: "¿Cómo cambio el idioma de la interfaz?",
      answer: "Actualmente el software solo está disponible en español. Estamos trabajando en añadir más idiomas en futuras versiones."
    }
  ];

  const guides = [
    {
      title: "Primeros pasos",
      steps: [
        "Configura tu perfil en la sección de Configuración",
        "Importa tus datos iniciales desde Excel o CSV",
        "Crea tu primer proyecto o cliente"
      ]
    },
    {
      title: "Generar reportes",
      steps: [
        "Selecciona el tipo de reporte que necesitas",
        "Ajusta los filtros y parámetros",
        "Exporta o comparte el resultado"
      ]
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title flex items-center">
                  <Info className="mr-2" size={20} />
                  Acerca del Software
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Versión</h4>
                    <p className="text-base-content/80">1.2.3 (Build 2023.12.01)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Licencia</h4>
                    <p className="text-base-content/80">Suscripción anual - Empresa</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Desarrollador</h4>
                    <p className="text-base-content/80">SGALDevs S.A.</p>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <HelpCircle className="mr-2" size={20} />
              Preguntas frecuentes
            </h3>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <div key={faq.id} className="collapse collapse-plus bg-base-100 rounded-box shadow-sm">
                  <input 
                    type="radio" 
                    name="faq-accordion" 
                    checked={expandedFaq === faq.id}
                    onChange={() => toggleFaq(faq.id)}
                  />
                  <div className="collapse-title font-medium">
                    {faq.question}
                  </div>
                  <div className="collapse-content">
                    <p className="text-base-content/80">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'guides':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="mr-2" size={20} />
              Guías rápidas
            </h3>
            {guides.map((guide, index) => (
              <div key={index} className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">{guide.title}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="text-base-content/80">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title flex items-center">
                  <Mail className="mr-2" size={20} />
                  Contacto de soporte
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Correo electrónico</h4>
                    <p className="text-base-content/80">soporte@sgaldevs.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Teléfono</h4>
                    <p className="text-base-content/80">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Horario de atención</h4>
                    <p className="text-base-content/80">Lunes a Viernes, 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title flex items-center">
                  <MessageSquare className="mr-2" size={20} />
                  Envíanos un mensaje
                </h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Asunto</span>
                    </label>
                    <select className="select select-bordered">
                      <option disabled selected>Selecciona un tema</option>
                      <option>Problema técnico</option>
                      <option>Solicitud de función</option>
                      <option>Consulta general</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Mensaje</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-24" placeholder="Describe tu consulta..."></textarea>
                  </div>
                  <button className="btn btn-outline">Enviar mensaje</button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <HelpCircle className="mr-2 text-primary" size={24} />
        <h2 className="text-2xl font-bold">Centro de ayuda</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navegación lateral */}
        <div className="w-full md:w-64">
          <ul className="menu bg-base-100 rounded-box shadow-sm">
            <li>
              <button
                className={`flex items-center ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <Info className="mr-2" size={18} />
                Acerca del software
              </button>
            </li>
            <li>
              <button
                className={`flex items-center ${activeTab === 'faq' ? 'active' : ''}`}
                onClick={() => setActiveTab('faq')}
              >
                <HelpCircle className="mr-2" size={18} />
                Preguntas frecuentes
              </button>
            </li>
            <li>
              <button
                className={`flex items-center ${activeTab === 'guides' ? 'active' : ''}`}
                onClick={() => setActiveTab('guides')}
              >
                <BookOpen className="mr-2" size={18} />
                Guías rápidas
              </button>
            </li>
            <li>
              <button
                className={`flex items-center ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                <Mail className="mr-2" size={18} />
                Contactar soporte
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TabHelp;