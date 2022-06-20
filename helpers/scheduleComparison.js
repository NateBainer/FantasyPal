

const ANAsched = require('../db/anaheim-ducks/ANAsched')
const ARIsched = require('../db/arizona-coyotes/ARIsched')
const BOSsched = require('../db/boston-bruins/BOSsched')
const BUFsched = require('../db/buffalo-sabres/BUFsched')
const CALsched = require('../db/calgary-flames/CALsched')
const CARsched = require('../db/carolina-hurricanes/CARsched')
const CHIsched = require('../db/chicago-blackhawks/CHIsched')
const COLsched = require('../db/colorado-avalanche/COLsched')
const CBJsched = require('../db/columbus-blue-jackets/CBJsched')
const DALsched = require('../db/dallas-stars/DALsched')
const DETsched = require('../db/detroit-red-wings/DETsched')
const EDMsched = require('../db/edmonton-oilers/EDMsched')
const FLOsched = require('../db/florida-panthers/FLOsched')
const LAKsched = require('../db/los-angeles-kings/LAKsched')
const MINsched = require('../db/minnesota-wild/MINsched')
const MTLsched = require('../db/montreal-canadiens/MTLsched')
const NASsched = require('../db/nashville-predators/NASsched')
const NJDsched = require('../db/new-jersey-devils/NJDsched')
const NYIsched = require('../db/new-york-islanders/NYIsched')
const NYRsched = require('../db/new-york-rangers/NYRsched')
const OTTsched = require('../db/ottawa-senators/OTTsched')
const PHIsched = require('../db/philadelphia-flyers/PHIsched')
const PITsched = require('../db/pittsburgh-penguins/PITsched')
const SJSsched = require('../db/san-jose-sharks/SJSsched')
const SEAsched = require('../db/seattle-kraken/SEAsched')
const STLsched = require('../db/st-louis-blues/STLsched')
const TBLsched = require('../db/tampa-bay-lightning/TBLsched')
const TMLsched = require('../db/toronto-maple-leafs/TMLsched')
const VANsched = require('../db/vancouver-canucks/VANsched')
const VGKsched = require('../db/vegas-golden-knights/VGKsched')
const WASsched = require('../db/washington-capitals/WASsched')
const WINsched = require('../db/winnipeg-jets/WINsched')




const scheduleComparison = (arr1, arr2, date) => {
  const sameDays = [];  // Array to contain match elements
  for(var i=0 ; i<arr1.length ; ++i) {
    for(var j=0 ; j<arr2.length ; ++j) {
      if (date >= arr1[i]) { // only access numbers greater than current date (later days)
        
      } else {
      if(arr1[i] == arr2[j]) {    // If element is in both the arrays
        sameDays.push(arr1[i]);        // Push to arr array
        }
      }
    }
  }
   
  return sameDays.length;  // Return the length arr elements
}  

console.log(scheduleComparison(ANAsched, BOSsched, 10))