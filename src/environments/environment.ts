// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // serverApiUrl: 'http://localhost:9090/api',
  //  socketServer: 'http://192.168.101.254:9091',
  serverApiUrl: 'https://api.crunchtimedelivery.co.za/api',
  socketServer: 'https://192.168.101.238:9090',
  // serverApiUrl: 'https://crunchtimeprod-env-1.eba-icv5tqim.eu-west-1.elasticbeanstalk.com/api',
  peachPaymentWidget: 'https://eu-prod.oppwa.com/v1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames io,p.[/+0 asDF GTYHUJIOP[]\7859+  such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.