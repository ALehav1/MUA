import { ProjectContext, ActionLog, ValidationRule } from '../types/mcpTypes';

export const createActionLog = (action: string, details: any, payload?: any): ActionLog => {
  return {
    timestamp: new Date().toISOString(),
    action,
    details,
    payload
  };
};

export const updateProjectContext = (context: ProjectContext, actionLog: ActionLog): ProjectContext => {
  return {
    ...context,
    actionLog: [...context.actionLog, actionLog]
  };
};

export const validateProjectContext = (context: ProjectContext): boolean => {
  if (!context.components || typeof context.components !== 'object') {
    return false;
  }

  if (!context.state || typeof context.state !== 'object') {
    return false;
  }

  if (!Array.isArray(context.actionLog)) {
    return false;
  }

  if (!context.projectRoot || typeof context.projectRoot !== 'string') {
    return false;
  }

  return true;
};

export const getValidationRules = (): ValidationRule[] => {
  return [
    {
      type: 'FILE_MODIFIED',
      pattern: '.*',
      message: 'File modification validation',
      action: 'FILE_MODIFIED',
      validate: (payload: any, context: ProjectContext): boolean => {
        return !!payload.filePath && typeof payload.filePath === 'string';
      }
    },
    {
      type: 'COMPONENT_ADDED',
      pattern: '.*',
      message: 'Component addition validation',
      action: 'COMPONENT_ADDED',
      validate: (payload: any, context: ProjectContext): boolean => {
        return (
          !!payload.componentName &&
          typeof payload.componentName === 'string' &&
          !!payload.filePath &&
          typeof payload.filePath === 'string' &&
          Array.isArray(payload.dependencies)
        );
      }
    }
  ];
};

export async function validateAction(
  action: string,
  payload: any,
  context: ProjectContext
): Promise<boolean> {
  // Basic validation
  if (!action || !payload) {
    return false;
  }

  // Get validation rules
  const rules = getValidationRules();
  const rule = rules.find(r => r.type === action);

  if (!rule) {
    return true; // No validation rule found, assume valid
  }

  // Execute validation
  if (rule.validate) {
    return rule.validate(payload, context);
  }

  // Default validation
  return true;
}

export async function trackChanges(
  action: string,
  payload: any,
  context: ProjectContext
): Promise<ActionLog> {
  return {
    timestamp: new Date().toISOString(),
    action,
    details: payload,
    payload
  };
}

export function updateDocumentation(
  file: string,
  type: 'added' | 'modified' | 'deleted',
  summary: string
): void {
  // Implement documentation update logic
  console.log(`Documentation ${type}: ${file} - ${summary}`);
}

export function validateDependencies(
  dependencies: Record<string, string>
): boolean {
  // Implement dependency validation logic
  return true;
}

export function checkComponentConsistency(
  components: string[],
  context: ProjectContext
): boolean {
  // Implement component consistency check
  return true;
} 