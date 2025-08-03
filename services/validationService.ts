export const validationService = {
  // Validar título de lista
  validateListTitle: (title: string): { isValid: boolean; error?: string } => {
    if (!title || title.trim() === '') {
      return { isValid: false, error: 'El nombre de la lista no puede estar vacío' };
    }
    
    if (title.trim().length < 2) {
      return { isValid: false, error: 'El nombre de la lista debe tener al menos 2 caracteres' };
    }
    
    if (title.trim().length > 50) {
      return { isValid: false, error: 'El nombre de la lista no puede exceder 50 caracteres' };
    }
    
    // Validar caracteres especiales problemáticos
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(title)) {
      return { isValid: false, error: 'El nombre contiene caracteres no permitidos' };
    }
    
    return { isValid: true };
  },

  // Validar título de tarea
  validateTaskTitle: (title: string): { isValid: boolean; error?: string } => {
    if (!title || title.trim() === '') {
      return { isValid: false, error: 'El nombre de la tarea no puede estar vacío' };
    }
    
    if (title.trim().length < 1) {
      return { isValid: false, error: 'El nombre de la tarea debe tener al menos 1 caracter' };
    }
    
    if (title.trim().length > 100) {
      return { isValid: false, error: 'El nombre de la tarea no puede exceder 100 caracteres' };
    }
    
    return { isValid: true };
  },

  // Validar fecha de recordatorio
  validateReminderDate: (date: string): { isValid: boolean; error?: string } => {
    if (!date || date.trim() === '') {
      return { isValid: false, error: 'La fecha es requerida' };
    }
    
    // Validar formato YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return { isValid: false, error: 'Formato de fecha inválido. Use YYYY-MM-DD' };
    }
    
    // Validar que sea una fecha válida
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: 'Fecha inválida' };
    }
    
    // Validar que no sea una fecha muy antigua
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    if (dateObj < minDate) {
      return { isValid: false, error: 'La fecha no puede ser anterior a un año' };
    }
    
    // Validar que no sea una fecha muy futura
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);
    if (dateObj > maxDate) {
      return { isValid: false, error: 'La fecha no puede ser posterior a 5 años' };
    }
    
    return { isValid: true };
  },

  // Validar hora de recordatorio
  validateReminderTime: (time: string): { isValid: boolean; error?: string } => {
    if (!time || time.trim() === '') {
      return { isValid: false, error: 'La hora es requerida' };
    }
    
    // Validar formato HH:MM
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return { isValid: false, error: 'Formato de hora inválido. Use HH:MM' };
    }
    
    return { isValid: true };
  },

  // Validar fecha y hora combinadas para recordatorio
  validateReminderDateTime: (date: string, time: string): { isValid: boolean; error?: string } => {
    const dateValidation = validationService.validateReminderDate(date);
    if (!dateValidation.isValid) {
      return dateValidation;
    }
    
    const timeValidation = validationService.validateReminderTime(time);
    if (!timeValidation.isValid) {
      return timeValidation;
    }
    
    // Validar que la fecha y hora combinadas sean futuras
    try {
      const dateTime = new Date(`${date}T${time}`);
      const now = new Date();
      
      if (dateTime <= now) {
        return { isValid: false, error: 'La fecha y hora del recordatorio debe ser futura' };
      }
      
      // Validar que no sea demasiado pronto (al menos 1 minuto)
      const minTime = new Date(now.getTime() + 60000); // +1 minuto
      if (dateTime < minTime) {
        return { isValid: false, error: 'El recordatorio debe ser al menos 1 minuto en el futuro' };
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Fecha y hora inválidas' };
    }
  },

  // Validar duplicados en lista de títulos
  validateDuplicateTitle: (
    newTitle: string, 
    existingTitles: string[], 
    currentTitle?: string
  ): { isValid: boolean; error?: string } => {
    const trimmedNewTitle = newTitle.trim().toLowerCase();
    const trimmedCurrentTitle = currentTitle?.trim().toLowerCase();
    
    const isDuplicate = existingTitles.some(title => 
      title.trim().toLowerCase() === trimmedNewTitle && 
      title.trim().toLowerCase() !== trimmedCurrentTitle
    );
    
    if (isDuplicate) {
      return { isValid: false, error: 'Ya existe un elemento con este nombre' };
    }
    
    return { isValid: true };
  },

  // Sanitizar texto de entrada
  sanitizeText: (text: string): string => {
    if (!text) return '';
    
    return text
      .trim()
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
      .replace(/^\s+|\s+$/g, ''); // Eliminar espacios al inicio y final
  },

  // Validar ID
  validateId: (id: string): { isValid: boolean; error?: string } => {
    if (!id || id.trim() === '') {
      return { isValid: false, error: 'ID requerido' };
    }
    
    if (id.length < 10) {
      return { isValid: false, error: 'ID inválido' };
    }
    
    return { isValid: true };
  },

  // Validar array no vacío
  validateNonEmptyArray: <T>(array: T[], itemName: string): { isValid: boolean; error?: string } => {
    if (!Array.isArray(array) || array.length === 0) {
      return { isValid: false, error: `No hay ${itemName} disponibles` };
    }
    
    return { isValid: true };
  }
};