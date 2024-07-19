function differenceInAges(ages){
    let maxEdad = Math.max(...ages)
    let minEdad = Math.min(...ages)
    return [minEdad, maxEdad, (maxEdad - minEdad)];
  }
  
  console.log(differenceInAges([82, 15, 6, 38, 35]))
  