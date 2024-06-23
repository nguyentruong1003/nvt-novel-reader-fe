import { HttpHeaders } from '@angular/common/http';

export default class CommonUtil {
  static headers(isLoading: boolean): HttpHeaders {
    return new HttpHeaders({
      isLoading: isLoading ? 'true' : 'false',
    });
  }

  static stripHTML(htmlText: string): string {
    return htmlText?htmlText.replace(/<\/?[^>]+(>|$)/g, ''):'';
  }

  static extractContent(s:any) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };
}
