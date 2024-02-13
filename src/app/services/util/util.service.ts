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
}
