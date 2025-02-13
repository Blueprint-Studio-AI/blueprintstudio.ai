// types/html2pdf.d.ts
declare module 'html2pdf.js' {
    interface Options {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: { type?: string; quality?: number };
      html2canvas?: { scale?: number; logging?: boolean };
      jsPDF?: { unit?: string; format?: string; orientation?: string };
    }
  
    interface HTML2PDF {
      set(options: Options): HTML2PDF;
      from(element: HTMLElement | string): HTML2PDF;
      save(): Promise<void>;
      toPdf(): HTML2PDF;
      get(callback: Function): HTML2PDF;
    }
  
    function html2pdf(): HTML2PDF;
    function html2pdf(element: HTMLElement | string, options?: Options): HTML2PDF;
  
    export default html2pdf;
  }