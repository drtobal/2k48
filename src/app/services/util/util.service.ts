import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  /** deep clone of an object */
  static deepClone<T>(obj: T): T {
    if (typeof structuredClone === 'function') {
      return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
  }

  /** uuid is only available in localhost, 127.0.0.1 or https context, for demo reasons will use custom id generator */
  static id(): string {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) => {
      console.log(c);
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
  }
}
