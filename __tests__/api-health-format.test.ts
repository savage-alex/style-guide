import { DiagnosticSeverity } from '@stoplight/types';
import testRule from './__helpers__/helper';

const template = (contentType: string) => {
  return {
    openapi: '3.1.0',
    info: { version: '1.0', contact: {} },
    paths: { 
      "/health": {
        "get": {
          "summary": "Your health endpoint",
          "responses": {
            "200": {
              "description": "Error",
              "content": {
                [contentType]: {}
              }
            }
          }
        }
      }
    }
  }
};

testRule('api-health-format', [
  {
    name: 'valid case',
    document: template('application/vnd.health+json'),
    errors: [],
  },

  {
    name: 'invalid case if plain json',
    document: template('application/json'),
    errors: [
      {
        message: 'Use existing standards (and draft standards) wherever possible, like the draft standard for health checks: https://datatracker.ietf.org/doc/html/draft-inadarei-api-health-check.',
        path: ['paths', "/health", "get", "responses", "200", "content", "application/json"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: 'invalid case if any other mime type',
    document: template('text/png'),
    errors: [
      {
        message: 'Use existing standards (and draft standards) wherever possible, like the draft standard for health checks: https://datatracker.ietf.org/doc/html/draft-inadarei-api-health-check.',
        path: ['paths', "/health", "get", "responses", "200", "content", "text/png"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
