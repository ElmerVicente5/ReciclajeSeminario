import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useAcopio } from "../../hooks/useAcopio";

export default function AcopioForm({ show, onHide, editingAcopio = null, onSuccess }) {
  const { crearAcopio, actualizarAcopio, validarDatosAcopio, loading, error } = useAcopio();
  
  const [formData, setFormData] = useState({
    tipo: '',
    nombre: '',
    latitud: '',
    longitud: '',
    direccion: '',
    zona_id: '',
    horario: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Tipos de centro predefinidos
  const tiposCentro = [
    'Centro de Reciclaje',
    'Punto de Acopio',
    'Centro de Compostaje',
    'Estación de Transferencia',
    'Centro de Clasificación'
  ];

  // Determinar si estamos en modo edición
  const isEditMode = editingAcopio && editingAcopio.id;

  // Cargar datos si está editando
  useEffect(() => {
    if (show) {
      if (isEditMode) {
        console.log('Cargando datos para editar:', editingAcopio);
        setFormData({
          tipo: editingAcopio.tipo || '',
          nombre: editingAcopio.nombre || '',
          latitud: editingAcopio.latitud ? String(editingAcopio.latitud) : '',
          longitud: editingAcopio.longitud ? String(editingAcopio.longitud) : '',
          direccion: editingAcopio.direccion || '',
          zona_id: editingAcopio.zona_id ? String(editingAcopio.zona_id) : '',
          horario: editingAcopio.horario || ''
        });
      } else {
        setFormData({
          tipo: '',
          nombre: '',
          latitud: '',
          longitud: '',
          direccion: '',
          zona_id: '',
          horario: ''
        });
      }
      setErrors({});
    }
  }, [editingAcopio, show, isEditMode]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const submitData = {
      ...formData,
      latitud: formData.latitud ? parseFloat(formData.latitud) : null,
      longitud: formData.longitud ? parseFloat(formData.longitud) : null,
      zona_id: formData.zona_id ? parseInt(formData.zona_id) : null
    };

    const validation = validarDatosAcopio(submitData);
    
    if (!validation.valido) {
      const newErrors = {};
      validation.errores.forEach(error => {
        if (error.includes('nombre')) newErrors.nombre = error;
        if (error.includes('latitud')) newErrors.latitud = error;
        if (error.includes('longitud')) newErrors.longitud = error;
        if (error.includes('zona')) newErrors.zona_id = error;
        if (error.includes('horario')) newErrors.horario = error;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const submitData = {
        tipo: formData.tipo || null,
        nombre: formData.nombre.trim(),
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null,
        direccion: formData.direccion || null,
        zona_id: formData.zona_id ? parseInt(formData.zona_id) : null,
        horario: formData.horario || null
      };

      let result;
      if (isEditMode) {
        result = await actualizarAcopio(editingAcopio.id, submitData);
      } else {
        result = await crearAcopio(submitData);
      }
      
      console.log('Resultado:', result);
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error al guardar centro de acopio:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="acopio-form-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <i className="fas fa-map-marker-alt me-2"></i>
          {isEditMode ? `Editar Centro: ${editingAcopio?.nombre}` : 'Agregar Nuevo Centro de Acopio'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Advertencia sobre APIs no implementadas */}
        <Alert variant="warning" className="mb-3">
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>
              <strong>Nota de Desarrollo:</strong> Las operaciones de crear, editar y eliminar están preparadas 
              pero requieren que el backend implemente las APIs correspondientes.
            </div>
          </div>
        </Alert>

        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Información del centro actual en modo edición */}
        {isEditMode && (
          <Alert variant="info" className="mb-3">
            <h6 className="alert-heading mb-2 d-flex align-items-center">
              <i className="fas fa-info-circle me-2"></i>
              Editando Centro Existente
            </h6>
            <Row className="g-2">
              <Col md={4}>
                <small><strong>ID:</strong> {editingAcopio.id}</small>
              </Col>
              <Col md={4}>
                <small><strong>Zona:</strong> {editingAcopio.zonas?.nombre || `ID: ${editingAcopio.zona_id}`}</small>
              </Col>
              <Col md={4}>
                <small><strong>Estado:</strong> 
                  <Badge bg={editingAcopio.estado === 'Activo' ? 'success' : 
                             editingAcopio.estado === 'Saturado' ? 'warning' : 'danger'} 
                         className="ms-1">
                    {editingAcopio.estado}
                  </Badge>
                </small>
              </Col>
            </Row>
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Nombre del Centro *
                  <i className="fas fa-building ms-1 text-muted"></i>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  isInvalid={!!errors.nombre}
                  placeholder="Ej: Centro Norte de Reciclaje"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Tipo de Centro
                  <i className="fas fa-tags ms-1 text-muted"></i>
                </Form.Label>
                <Form.Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un tipo</option>
                  {tiposCentro.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Latitud
                  <i className="fas fa-globe-americas ms-1 text-muted"></i>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="latitud"
                  value={formData.latitud}
                  onChange={handleChange}
                  isInvalid={!!errors.latitud}
                  placeholder="-17.7835"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.latitud}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Valor entre -90 y 90
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Longitud
                  <i className="fas fa-globe-americas ms-1 text-muted"></i>
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="longitud"
                  value={formData.longitud}
                  onChange={handleChange}
                  isInvalid={!!errors.longitud}
                  placeholder="-63.1821"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.longitud}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Valor entre -180 y 180
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  ID de Zona
                  <i className="fas fa-map ms-1 text-muted"></i>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="zona_id"
                  value={formData.zona_id}
                  onChange={handleChange}
                  isInvalid={!!errors.zona_id}
                  placeholder="1"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.zona_id}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  ID numérico de la zona existente
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Horario de Atención
                  <i className="fas fa-clock ms-1 text-muted"></i>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  isInvalid={!!errors.horario}
                  placeholder="08:00-17:00"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.horario}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Formato: HH:MM-HH:MM
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              Dirección
              <i className="fas fa-map-marker-alt ms-1 text-muted"></i>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Dirección completa del centro de acopio..."
            />
          </Form.Group>

          {/* Información adicional */}
          <Alert variant="light" className="mb-0">
            <Row>
              <Col md={6}>
                <small>
                  <i className="fas fa-star text-warning me-1"></i>
                  <strong>Campos obligatorios:</strong> Solo el nombre es obligatorio.
                </small>
              </Col>
              <Col md={6}>
                <small>
                  <i className="fas fa-map text-info me-1"></i>
                  <strong>Coordenadas:</strong> Útiles para mostrar en el mapa.
                </small>
              </Col>
            </Row>
          </Alert>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <small className="text-muted">
            <i className="fas fa-database me-1"></i>
            {isEditMode ? 'Editando registro existente' : 'Creando nuevo registro'}
          </small>
        </div>
        <div>
          <Button variant="secondary" onClick={onHide} disabled={submitting} className="me-2">
            <i className="fas fa-times me-1"></i>
            Cancelar
          </Button>
          <Button 
            variant={isEditMode ? "warning" : "success"}
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="d-flex align-items-center"
          >
            {submitting ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                {isEditMode ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus'} me-2`}></i>
                {isEditMode ? 'Actualizar Centro' : 'Crear Centro'}
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
