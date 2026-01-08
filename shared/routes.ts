import { z } from 'zod';
import { 
  insertStudentSchema, 
  insertParentSchema, 
  insertFeeSchema, 
  insertPaymentSchema, 
  insertAttendanceSchema, 
  insertExamSchema, 
  insertMarkSchema, 
  insertNoticeSchema,
  students,
  parents,
  fees,
  payments,
  attendance,
  exams,
  marks,
  notices
} from './schema';

export * from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  students: {
    list: {
      method: 'GET' as const,
      path: '/api/students',
      responses: {
        200: z.array(z.custom<typeof students.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/students',
      input: insertStudentSchema,
      responses: {
        201: z.custom<typeof students.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/students/:id',
      responses: {
        200: z.custom<typeof students.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/students/:id',
      input: insertStudentSchema.partial(),
      responses: {
        200: z.custom<typeof students.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/students/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  parents: {
    list: {
      method: 'GET' as const,
      path: '/api/parents',
      responses: {
        200: z.array(z.custom<typeof parents.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/parents',
      input: insertParentSchema,
      responses: {
        201: z.custom<typeof parents.$inferSelect>(),
      },
    },
  },
  fees: {
    list: {
      method: 'GET' as const,
      path: '/api/fees',
      responses: {
        200: z.array(z.custom<typeof fees.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/fees',
      input: insertFeeSchema,
      responses: {
        201: z.custom<typeof fees.$inferSelect>(),
      },
    },
  },
  payments: {
    list: {
      method: 'GET' as const,
      path: '/api/payments',
      responses: {
        200: z.array(z.custom<typeof payments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/payments',
      input: insertPaymentSchema,
      responses: {
        201: z.custom<typeof payments.$inferSelect>(),
      },
    },
  },
  attendance: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance',
      responses: {
        200: z.array(z.custom<typeof attendance.$inferSelect>()),
      },
    },
    mark: {
      method: 'POST' as const,
      path: '/api/attendance',
      input: insertAttendanceSchema,
      responses: {
        201: z.custom<typeof attendance.$inferSelect>(),
      },
    },
  },
  exams: {
    list: {
      method: 'GET' as const,
      path: '/api/exams',
      responses: {
        200: z.array(z.custom<typeof exams.$inferSelect>()),
      },
    },
  },
  marks: {
    list: {
      method: 'GET' as const,
      path: '/api/marks',
      responses: {
        200: z.array(z.custom<typeof marks.$inferSelect>()),
      },
    },
    record: {
      method: 'POST' as const,
      path: '/api/marks',
      input: insertMarkSchema,
      responses: {
        201: z.custom<typeof marks.$inferSelect>(),
      },
    },
  },
  notices: {
    list: {
      method: 'GET' as const,
      path: '/api/notices',
      responses: {
        200: z.array(z.custom<typeof notices.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notices',
      input: insertNoticeSchema,
      responses: {
        201: z.custom<typeof notices.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
