import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR, TIPO_ACCESO } from "./instrucciones";

export default function Traucir(salida, consola, traduccion, printedTable, tablero){
    const contadores = {temporales:0, etiquetas:0};
    const pilas = {stack:0, heap:0};
    const stack = [], heap=[];
   let output="";
   printedTable.erEj=salida.ErrArr;
   const tsGlobal = new TS([], consola);
   try {
        consola.value="void main()\n{\n";
        setSalida(salida.Errores);       
        scanForTypes(salida.AST, tsGlobal); 
        scanForFunctions(salida.AST, tsGlobal, "Global");
        let returnedAcction =  procesarBloque(salida.AST, tsGlobal, "Global");
        if(returnedAcction!=undefined){
            if(returnedAcction.sentencia===SENTENCIAS.BREAK){
                consola.value+='>ERROR: Break fuera de un ciclo.';  
                throw '>ERROR: Break fuera de un ciclo.';  
            }else if(returnedAcction.sentencia===SENTENCIAS.RETURN){
                consola.value+='>ERROR: Return fuera de una función.';  
                throw '>ERROR:Return fuera de una función.';  
            }else if(returnedAcction.sentencia===SENTENCIAS.CONTINUE){
                consola.value+='>ERROR: Continue fuera de un ciclo.';  
                throw '>ERROR: Continue fuera de un ciclo.';  
            }
        }
        consola.value="#include <stdio.h> //Importar para el uso de Printf\nfloat heap[16384]; //Estructura para heap\nfloat stack[16394]; //Estructura para stack\nfloat p; //Puntero P\nfloat h; //Puntero H\nfloat "+printTemporales()+consola.value+"\nreturn;\n}";
        traduccion.setValue(output);
        console.log(tsGlobal);
        sendTable(tsGlobal);
    } catch (e) {
        console.error(e);
        return;
    }
    function procesarBloque(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
            if (instruccion.sentencia === SENTENCIAS.DECLARACION) {
                try{
                    procesarDeclaracion(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.ASIGNACION) {
                try{
                    procesarAsigacion(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.IMPRIMIR){
                try{
                    procesarImpresion(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.ACCESO){
                try{
                    procesarAccID(instruccion.id, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.IF){                
                try{
                    let returnedAcction = procesarIf(instruccion, tablaDeSimbolos, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarFor(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_OF) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarForOF(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_IN) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarForIn(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.WHILE) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarWhile(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.DO_WHILE) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarDoWhile(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                        console.error(e);
                    }
            }else if(instruccion.sentencia === SENTENCIAS.LLAMADA){ 
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);               
                    procesarLlamada(instruccion, tsFor, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.INCREMENTO){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.DECREMENTO  ){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.ASIGNACION_SUMA  ){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.ASIGNACION_RESTA  ){
                try{
                    procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia === SENTENCIAS.SWITCH){ 
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);               
                    let returnedAcction =  procesarSwitch(instruccion, tsFor, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.BREAK){
                try{
                    return {sentencia:SENTENCIAS.BREAK};
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.CONTINUE){
                try{
                    return {sentencia:SENTENCIAS.CONTINUE};
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.RETURN){
                try{
                    if(instruccion.valor=="Epsilon"){
                    return {sentencia:SENTENCIAS.RETURN, valor:"undefined"};
                    }else{
                        return {sentencia:SENTENCIAS.RETURN, valor:procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito)};
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.GRAFICAR_TS){
                try{
                    const tsFor = new TS(JSON.parse(JSON.stringify(tablaDeSimbolos.simbolos)), consola);  
                    graficar_Ts(tsFor, ambito);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
    function setSalida(Errores){
        if(Errores.length>0){
        consola.value+="ALERTA:\nExisten errores, consulta la tabla de errores para localizarlos.\nNota: Si son errores sintácticos intenta ver las línea superiores para hallar el causante.\n\n";
        return;
        }
        for(let error of Errores){
            consola.value+="> "+error+"\n";
        }
    }
    function sendTable(tablaDeSimbolos){
        printedTable.tsEj=tablaDeSimbolos;
    }
    function scanForFunctions(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
                if(instruccion.sentencia==SENTENCIAS.FUNCION){
                    if(ambito=="Global"){ 
                            if(tablaDeSimbolos.existe(instruccion.id, ambito, "funcion")){
                                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+'\n>ERROR: No se soporta la sobrecarga de funciones, id repetido :'+instruccion.id;  
                                throw '>ERROR: No se soporta la sobrecarga de funciones, id repetido :'+instruccion.id;
                            }  
                            let dataType = procesarDataType(instruccion.tipo);
                            console.log(tablaDeSimbolos.existe(dataType.split("[]")[0], undefined, "type"));
                            if(tablaDeSimbolos.existe(dataType.split("[]")[0], undefined, "type")==false && dataType.split("[]")[0]!="number" && dataType.split("[]")[0]!="string"&& dataType.split("[]")[0]!="void" && dataType.split("[]")[0]!="boolean"){
                                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+'\n>ERROR: Type '+dataType.split("[]")[0]+' no ha sido definido y es el tipo de retorno de la función:'+instruccion.id;  
                                throw '>ERROR: Type '+dataType.split("[]")[0]+' no ha sido definido y es el tipo de retorno de la función:'+instruccion.id;  
                            }
                            tablaDeSimbolos.agregarFuncion(instruccion.id, procesarDataType(instruccion.tipo), procesarParametros(instruccion.parametros), instruccion.accion, ambito, instruccion.fila, instruccion.columna);
                            scanForFunctions(instruccion.accion, tablaDeSimbolos, instruccion.id);
                    }else{      
                        consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+'\n>ERROR: Funciones anidadas en la función:'+ambito;  
                        throw '>ERROR: Funciones anidadas en la función:'+ambito;
                    } 
                }  
        }    
    }
    function scanForTypes(instrucciones, tablaDeSimbolos){
        for(let instruccion of instrucciones){
            if(instruccion.sentencia==SENTENCIAS.TYPE_DECLARATION){
                tablaDeSimbolos.agregarType(instruccion.id, procesarAtributos(instruccion.atributos), instruccion.fila, instruccion.columna);
            }
        }
    }
    function procesarAtributos(atributos){
        let tempAtributos = [];
        let temp = atributos;
        while(temp!="Epsilon"){
            tempAtributos.push({id:temp.id, tipo: procesarDataType(temp.data_type)});
            temp=temp.next;
        }
        return tempAtributos;
    }
    function procesarDataType(data_description){
        let dimension ="";
        let temp=data_description.isArray;
        while(temp!=false){
            dimension+="[]";
            temp=temp.next_dimension;
        }
        return data_description.tipo+dimension;
    }
    function primitive_Data(tipo){
        if (tipo === TIPO_DATO.NUMBER) {
            return "number";
        }else if (tipo === TIPO_DATO.BOOLEAN) {
            return "boolean";
        }else if (tipo === TIPO_DATO.STRING) {
            return "string";
        }else if (tipo === TIPO_DATO.VOID) {    
            return "void";
        }else{
            return tipo;
        }
    }
    function procesarParametros(parametros){
        let temporal=[];
        let temp = parametros;
        while(temp!="Epsilon"){
            temporal.push({id:temp.id, tipo: procesarDataType(temp.tipo)});
            temp=temp.siguiente;
        }
        return temporal;
    }
    function procesarDeclaracion(instruccion, tablaDeSimbolos, ambito){
        let temp= instruccion;
        while(temp!="Epsilon"){
            crearSimbolo(instruccion.variable_type, temp.id, {tipo:primitive_Data(temp.data_type), isArray:temp.isArray}, temp.expresion, ambito, tablaDeSimbolos, temp.fila, temp.columna);
            temp=temp.next_declaration;
        }
    }
    function procesarAsigacion(instruccion, tablaDeSimbolos, ambito){
        let assignedValue = procesarExpresionNumerica(instruccion.expresion, tablaDeSimbolos, ambito);
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        if(principalValue.var_type==TIPO_VARIABLE.CONST && instruccion.id.acc=="Epsilon"){
            consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n>ERROR: No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';  
            throw '>ERROR:  No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';   
        }
        let temp = instruccion.id.acc;
        let side="right";
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                        if(principalValue.valor==null){
                            //no estoy seguro si hacerlo así o solo pasarle el tipo
                            principalValue.valor=assignedValue.valor;
                            principalValue.tipo=assignedValue.tipo;
                            return;
                        }
                    }
                }
                side="both";
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    //consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    //throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n'; 
                   /* while(principalValue.valor.length!=valor.valor-1){
                        principalValue.valor.push();
                    }   */         
                    principalValue.valor[valor.valor]=assignedValue;
                    return;
                }
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                side="both"
            }else {
                consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';  
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
        }
        if(principalValue.tipo.split("[]")[0]=="undefined"){
            principalValue.valor=assignedValue.valor;
            principalValue.tipo=assignedValue.tipo;
        }else{
            if(assignedValue.valor==null){
                principalValue.valor=assignedValue.valor;
                principalValue.tipo=assignedValue.tipo;
            }else if(principalValue.tipo!=assignedValue.tipo){
                consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';  
                throw '>ERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';                
            }else{
                principalValue.valor=assignedValue.valor;
            }
        }
        //obtener el valor a cambiar y ver que  no sea const
        //
    }
    function procesarImpresion(instruccion, tablaDeSimbolos, ambito){
        const cadena = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                   consola.value += "> " + toString(cadena, tablaDeSimbolos, ambito)+ "\n";
    }
    function toString(cadena, tablaDeSimbolos, ambito){
        let text= "";
        if(cadena.tipo.split("[]").length>1){
            text+="[";
            for(let i = 0;i<cadena.valor.length;i++){
                text+=toString(cadena.valor[i], tablaDeSimbolos, ambito);
                if(i!=cadena.valor.length-1){
                    text+=", ";
                }
            }
            text+="]";
        }else if(tablaDeSimbolos.existe(cadena.tipo, undefined, "type")){
            text+="{";
            if(cadena.valor!=null){
                for(let i = 0;i<cadena.valor.length;i++){
                    if(cadena.valor[i].valor.valor!=null){
                        text+=cadena.valor[i].id+":"+toString(cadena.valor[i].valor, tablaDeSimbolos, ambito);
                    }else{
                        text+=cadena.valor[i].id+":null";
                    }
                    if(i!=cadena.valor.length-1){
                        text+=", ";
                    }
                }
            }else{
                text+="null";
            }
            text+="}";
        }else if(cadena.tipo==="string"){
            text+=sustituirEscapes(cadena);
        }else{
            text+=cadena.valor;
        }
        return text;
    }
    function sustituirEscapes(cadena){
        cadena.valor=String(cadena.valor).replace(/\\n/g,'\n')
        cadena.valor=String(cadena.valor).replace(/\\t/g,'\t')
        cadena.valor=String(cadena.valor).replace(/\\r/g,'\r')
        cadena.valor=String(cadena.valor).replace(/\\"/g,'\"')
        cadena.valor=String(cadena.valor).replace(/\\\\"/g,'\\')
        return cadena.valor;
    }
    function crearSimbolo(var_type, id, data_type, valor, ambito, tablaDeSimbolos, fila, columna){
        //Verificar que exista el tipo de dato de la variable
        data_type=procesarDataType(data_type);  //establece el tipo de la variable que es obligatorio declarar
        if(!tablaDeSimbolos.existe(data_type.split("[]")[0], undefined, "type") && data_type.split("[]")[0]!="number" && data_type.split("[]")[0]!="string" && data_type.split("[]")[0]!="boolean"){
            consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: No existe el tipo de dato:'+data_type.split("[]")[0]+'.\n';  
            printedTable.erEj.push({descripcion:'No existe el tipo de dato:'+data_type.split("[]")[0]+'.',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR: No existe el tipo de dato:'+data_type.split("[]")[0]+'.'; 
        }
        
        //Verificar que no exista en el mismo ámbito
        if(tablaDeSimbolos.existe(id, ambito, "variable")){
            consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito.\n';  
            printedTable.erEj.push({descripcion:'El identificador:\"'+id+'\" ya ha sido declarado en este ámbito',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito'; 
        }
        
        //Ver que el tipo de símbolo sea el correcto con el del valor o undefined
        if(var_type==TIPO_VARIABLE.CONST && valor == "undefined"){
            consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: La delcaracion de la constante '+id+' debe ser inicializada.\n';  
            printedTable.erEj.push({descripcion:'La delcaracion de  la constante '+id+' debe ser inicializada.\n',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR:La delcaracion de  la constante '+id+' debe ser inicializada.\n';             
        }
        let heapInit = pilas.heap;
        if(valor!="undefined"){
            valor=procesarExpresionNumerica(valor, tablaDeSimbolos, ambito, data_type.split("[]")[0]);
        }else{
            if(data_type=="number"){
                consola.value+="heap[(int)h]=0;\nh=h+1;";
                valor={valor:0,tipo:"number"};
                heapPush();
            }else if(data_type=="boolean"){
                valor={valor:false, tipo:"boolean"};
                consola.value+="heap[(int)h]=false;\nh=h+1;";
                heapPush();
            }else{
                valor={valor:null, tipo:data_type};
                consola.value+="heap[(int)h]=null;\nh=h+1;";
            }
        }
        if(data_type!=valor.tipo){  //se descarta la inferencia de tipos
            consola.value+='f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type+".\n";
            printedTable.erEj.push({descripcion:'Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type,ambito:ambito,tipo:"semántico", linea:fila, columna:columna});
            throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type;
        }
        
        //Crear simbolo
        if(valor.tipo.split("[]").length>1 || tablaDeSimbolos.existe(valor.tipo.split("[]")[0], undefined, "type") || ambito=="Global" || valor.tipo=="string"){
            //se va  al heap
            if(valor.tipo=="string"){
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, heapInit);
            }else if(valor.tipo.split("[]").length>1){
                if(valor.tipo.split("[]")[0]=="string" || tablaDeSimbolos.existe(valor.tipo.split("[]")[0], undefined, "type")){

                }else{
                    tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, heapInit);
                }
            }else{
                //consola.value+="heap[(int)h]="+ valor.valor+";\nh=h+1;\n";
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, heapInit);
            }
        }else{
            //se va al stack
            consola.value+="stack[(int)p]="+ valor.valor+";\np=p+1;\n";
            tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, stackPush());
        }
    }
    function procesarExpresionNumerica(expresion, tablaDeSimbolos, ambito, userType) {
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
            const valor = procesarLlamada(expresion, tablaDeSimbolos, ambito);
            if(valor.tipo=="void"){
                consola.value+='>f:'+expresion.fila+', c:'+expresion.columna+', ambito:'+ambito+'\nERROR: Función de tipo void como expresión.\n';  
                printedTable.erEj.push({descripcion:' Función de tipo void como expresión.',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: Función de tipo void como expresión.'; 
            }
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valor+";\n";
            return {valor:temporal,tipo:"number"};
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"=-"+valor+";\n";
            return {valor:temporal,tipo:"number"};
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"number"};
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"-"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"number", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"*"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"number", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if (valorDer == 0) throw 'Error: división entre 0 no está definida.';
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"/"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"number", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);

            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"*"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"number", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"%"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"number", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+">"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+">="+valorDer.valor+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"<"+valorDer.valor+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"<="+valorDer.valor+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq+"&&"+valorDer+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+valorIzq+"||"+valorDer+";\n";
            return {valor:temporal,tipo:"boolean"};
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            
            let temporal = nuevoTemporal();
            consola.value+=temporal+"=!"+valorIzq+";\n";
            return {valor:temporal,tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return {valor:expresion.valor, tipo:"number", tamanio:1};
        } else if (expresion.tipo === TIPO_VALOR.DECIMAL) {
            return {valor:expresion.valor, tipo:"number", tamanio:1};
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return {valor:true, tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return {valor:false, tipo:"boolean", tamanio:1};
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            const valIzq=procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
            return  valIzq.valor;
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: null, tipo: "undefined" , tamanio:1};
        } else if (expresion.data_type === TIPO_DATO.ARRAY) {
            return procesarArray(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo.split("[]").length>1){
            return procesarArray(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo === TIPO_DATO.OBJETO) {
            return procesarObjeto(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            let initial = nuevoTemporal();
            consola.value+=initial+"=h;\n";
            for(let i =0;i<expresion.valor.length;i++){
                consola.value+="heap[(int)h]="+ expresion.valor.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            return { valor: initial, tipo: "string" };
        } else if (expresion.tipo === TIPO_VALOR.CADENA_CHARS) {
            let initial = nuevoTemporal();
            consola.value+=initial+"=h;\n";
            for(let i =0;i<expresion.valor.length;i++){
                consola.value+="heap[(int)h]="+ expresion.valor.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            return { valor: initial, tipo: "string" };
        } else if(expresion.tipo===TIPO_DATO.OPERADOR_TERNARIO){
            let logica =  procesarExpresionNumerica(expresion.logica, tablaDeSimbolos, ambito);
            return logica.valor? procesarExpresionNumerica(expresion.result1, tablaDeSimbolos, ambito):procesarExpresionNumerica(expresion.result2, tablaDeSimbolos, ambito);
        } else {
            throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
        }
    }
    function procesarArray(arreglo, tablaDeSimbolos, ambito){
        let temporal = [];
        let temp = arreglo.dimension;
        let tamanio=0, temporalBegin = contadores.temporales+1;
        while(temp!="Epsilon"){
            temp=temp.next_data;
            consola.value+=nuevoTemporal()+"="+"h+"+tamanio+";\nh=h+1;\n";
            heapPush();
            tamanio++;
        }
        tamanio=0;
        temp = arreglo.dimension;
        while(temp!="Epsilon"){
            let valor = procesarExpresionNumerica(temp.dato, tablaDeSimbolos, ambito);
            consola.value+="heap[(int)t"+(temporalBegin+tamanio)+"]="+valor.valor+";\n";
            temporal.push(valor);
            temp=temp.next_data;
            tamanio++;
        }
        checkForMultyType(JSON.parse(JSON.stringify(temporal)), tablaDeSimbolos, ambito);
        return {tipo:getType(temporal)+calcularDimensiones(temporal), valor:"t"+temporalBegin};
    }
    function checkForMultyType(arreglo, tablaDeSimbolos, ambito){
        arreglo = JSON.parse(JSON.stringify(arreglo));
        if(arreglo.length>1){
            let temp = arreglo.pop();
            for(let temporal of arreglo){
                if(temp.tipo!=temporal.tipo){
                    if(temp.tipo.split("[]")[0]=="undefined" && temporal.tipo.split("[]")[0]=="undefined"){
                        //no es error solo están vacíos
                        arreglo.push(temp);
                    }else if(temp.tipo.split("[]")[0]=="undefined"){
                        temp.tipo=temporal.tipo;
                        arreglo.push(temp);
                    }else if(temporal.tipo.split("[]")[0]=="undefined"){
                        temporal.tipo=temp.tipo;
                        arreglo.push(temp);
                    }else{         
                        arreglo.push(temp);               
                        consola.value+='>ERROR: No se permiten los arreglos multitype->'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);  
                        throw '>ERROR: No se permiten los arreglos multitype'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);
                    }
                }
            }
        }
    }
    function getType(valor){
        while(Array.isArray(valor)){
            valor=valor[0];
        }
        if(valor==undefined) return "undefined";
        return valor.tipo;
    }
    function calcularDimensiones(valor){
        let contador="";
        while(Array.isArray(valor)){
            contador+="[]";
            valor=valor[0];
        }
        return contador;
    }
    function procesarObjeto(instruccion, tablaDeSimbolos, ambito, userType){
        if(!tablaDeSimbolos.existe(userType, undefined, "type")){
            printedTable.erEj.push({descripcion:'No existe el type:'+userType+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
            throw '>ERROR: No existe el type:'+userType+'.\n';                       
        }  
        let attb =[];
        let temp = instruccion.atributos;
        while(temp!="Epsilon"){
            //let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
            //attb.push({id:temp.id, valor:valor, tipo:valor.tipo});
            attb.push({id:temp.id});
            temp=temp.next;
        }
        let tipo = tablaDeSimbolos.obtenerType(userType);
        if(tipo.atributos.length!=attb.length){
            printedTable.erEj.push({descripcion:'Se deben inicializar todos los atributos del type.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
            throw '>ERROR: Se deben inicializar todos los atributos del type.\n'; 
        }
        temp = instruccion.atributos;
        let initial = pilas.heap, temporalInit=contadores.temporales+1;
        //declarar los atributos
        for(let atb in attb){
            consola.value+=nuevoTemporal()+"="+"h+"+atb+";\nh=h+1;\n";
        }
        //referenciar los atributos
        while(temp!="Epsilon"){
            let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
            consola.value+="heap[(int)t"+temporalInit+"]="+valor.valor+";\n";
            temp=temp.next;
            temporalInit++;
        }      
        return {valor:initial, tipo:userType};
    }
    function ExistingAttribute(typeID, attributeID, tablaDeSimbolos){
        let type = tablaDeSimbolos.obtenerType(typeID);
        for(let attribute of type.atributos){
            if(attribute.id==attributeID){
                return attribute;
            }
        }
        return false;
    }
    function procesarAccID(instruccion, tablaDeSimbolos, ambito){
        let principalValue = tablaDeSimbolos.obtenerSimbolo(instruccion.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        let temp = instruccion.acc;
        let side="right";
        /*
        side representa el lado de la expresión donde puede estar, siendo el lado derecho el valor asignado y en el lado
        izquierdo el espacio de memoria donde se puede guardar el valor.
        R->RIGHT
        B->BOTH
        N->NONE 
        */
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    printedTable.erEj.push({descripcion:'No existe el atributo '+temp.atributo+'',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                //para cuando sean atributos nulos
                if(principalValue.valor==null && tablaDeSimbolos.existe(principalValue.tipo, undefined, "type")){
                    break;
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                        //se tenía como principalValue.tipo=value.tipo pero cuando los atributos no traen definido el tipo se crea un vacío
                        if(value.tipo!="infer"){
                            principalValue.tipo=value.tipo;
                        }else{
                            principalValue.tipo=attribute.tipo;
                        }                        
                    }
                }
                side="both";
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    printedTable.erEj.push({descripcion:'Intento de acceso a posición de array inexistente',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    printedTable.erEj.push({descripcion:'No se reconoce la expresion '+valor.valor+' como un index.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }/*
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n';             
                }*/
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                if(principalValue==undefined){
                    return {valor:undefined, tipo:"undefined"};
                }
                side="both"
            }else if(temp.sentencia==SENTENCIAS.POP){//R
                side="right";
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Pop a un array inexistente.\n';  
                    printedTable.erEj.push({descripcion:'Intento de Pop a un array inexistente.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de Pop a un array inexistente.\n';                    
                }
                if(principalValue.length==0){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Pop a un array vacío.\n';  
                    printedTable.erEj.push({descripcion:'Intento de Pop a un array vacío.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de Pop a un array vacío.\n'; 
                }
                principalValue=principalValue.valor.pop();
                break;
            }else if(temp.sentencia==SENTENCIAS.LENGTH){//R
                side="right";
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Length a un array inexistente.\n';  
                    printedTable.erEj.push({descripcion:'Intento de Length a un array inexistente.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de Length a un array inexistente.\n';                    
                }
                principalValue={valor:principalValue.valor.length, tipo:"number"};
                break;
            }else if(temp.sentencia==SENTENCIAS.PUSH){//N
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Push a un array inexistente.\n';  
                    printedTable.erEj.push({descripcion:'Intento de Push a un array inexistente.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de Push a un array inexistente.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                principalValue.valor.push(valor);
                checkForMultyType(principalValue.valor, tablaDeSimbolos, ambito);
                side="none";
                break;
            }else if(temp.sentencia==SENTENCIAS.CHAR_AT){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede obtener un CharAt en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';  
                    printedTable.erEj.push({descripcion:''+valor.tipo+' no se puede usar como un índice en CharAt',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';                    
                }
                principalValue.valor=principalValue.valor.charAt(valor.valor);
                break;
            }else if(temp.sentencia==SENTENCIAS.TO_LOWER_CASE){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toLowerCase en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';                    
                }
                principalValue.valor=principalValue.valor.toLowerCase();
                break;
            }else if(temp.sentencia==SENTENCIAS.TO_UPPER_CASE){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                principalValue.valor=principalValue.valor.toUpperCase();
                break;
            }else if(temp.sentencia==SENTENCIAS.CONCAT){
                if(principalValue.tipo!="string"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="string" && valor.tipo!="number" && valor.tipo!="boolean" ){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede concatenar '+valor.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede concatenar '+valor.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No se puede concatenar '+valor.tipo+'.\n';                    
                }
                principalValue.valor=principalValue.valor.concat(valor.valor);
                break;
            }
            temp=temp.next_acc;
        }
        return {valor: principalValue.valor, side:side, tipo:principalValue.tipo};   
    }
    function SplitAmbitos(name){
        let ar = name.split("_");
        let er =[];
        for(let i =ar.length-1;i>=0;i--){
          let x="";
          for(let e =0;e<=i;e++){
            if(e==0){
              x+=ar[e];
            }else{
              x+="_"+ar[e];
            }    
          }
          er.push(x);
        }
        er.push("Global");
        return er;
    }
    function procesarLlamada(instruccion, tablaDeSimbolos, ambito){
        let funcion = tablaDeSimbolos.obtenerFuncion(instruccion.id, instruccion.fila, instruccion.columna, ambito);
        if(ambito==GetAmbito(instruccion.id) || instruccion.id.split("_").length==1 || instruccion.id==ambito){ //la tercera condición es para que acepte las llamadas recursivas de funciones desasinadas
            if (funcion.parametros.length != 0 && instruccion.parametros == "Epsilon") {
                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                throw 'ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            } else if (funcion.parametros.length == 0 && instruccion.parametros != "Epsilon") {
                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            }else{
                let argumentos = getArguments(instruccion.parametros, tablaDeSimbolos, ambito);
                const tsFuncion = new TS(tsGlobal.simbolos.slice(), consola);
                const tsTemp = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                for(let i = 0; i < funcion.parametros.length;i++){
                    if(funcion.parametros[i].tipo=="infer" || funcion.parametros[i].tipo==argumentos[i].tipo){
                        //se acepta el argumento para ser usado por los parámetros
                        tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else if(argumentos[i].tipo.split("[]")[0]=="undefined" && funcion.parametros[i].tipo==getType(argumentos[i].valor)+calcularDimensiones(argumentos[i].valor)){
                        //se acepta el argumento para ser usado por los parámetros
                        tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else if(tablaDeSimbolos.existe(funcion.parametros[i].tipo, undefined, "type") && argumentos[i].valor==null){
                        //para que acepte los nulls    
                        tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else{
                        consola.value+='ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                        printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                        throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                    }
                }               
                let returnedAcction;
                if(instruccion.id.split("_").length>1){
                    returnedAcction = procesarBloque(funcion.accion, tsTemp, instruccion.id);
                }else{
                    returnedAcction = procesarBloque(funcion.accion, tsFuncion, instruccion.id);
                }
                if(returnedAcction!=undefined){
                    /*if(returnedAcction.sentencia===SENTENCIAS.BREAK){
                        consola.value+='>ERROR: Break fuera de un ciclo.';  
                        throw '>ERROR: Break fuera de un ciclo.';  
                    }else*/
                    if(returnedAcction.sentencia===SENTENCIAS.RETURN){
                        if(returnedAcction.valor=="undefined" && funcion.tipo=="void"){
                            return {tipo:"void"};
                            //todo bien
                        }else if(returnedAcction.valor=="undefined" && funcion.tipo!="void"){
                            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede asignar void a '+funcion.tipo+'.\n';  
                            printedTable.erEj.push({descripcion:'  No se puede asignar void a '+funcion.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                            throw '>ERROR: No se puede asignar void a '+funcion.tipo+'.'; 
                        }else if(tablaDeSimbolos.existe(instruccion.id, undefined, "type") && returnedAcction.valor.valor==null){
                            //función de un type no nativo devulve null
                        }else if(returnedAcction.valor.tipo.split("[]")[0]=="undefined" && funcion.tipo==getType(returnedAcction.valor.valor)+calcularDimensiones(returnedAcction.valor.valor)){
                            //todo bien
                        }else if(returnedAcction.valor.tipo!=funcion.tipo){
                            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.';  
                            printedTable.erEj.push({descripcion:'No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                            throw '>ERROR: No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.'; 
                        } 
                        return returnedAcction.valor; 
                    }
                }
                //declarar parámetros con los valores de los argumentos
            }
        }else{
            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito+'.\n';  
            throw '>ERROR: No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito+'.\n'; 
        }        
    }
    function GetAmbito(ambito){
        let text="";
        if(ambito!="Global"){
            let temp = ambito.split("_");
            for(let i =0; i<temp.length-1;i++){
                if(i==0){
                    text+=ambito.split("_")[i];
                }else{
                    text+="_"+ambito.split("_")[i];
                }
            }
        }
        return text;
    }
    function getArguments(instruccion, tablaDeSimbolos, ambito){
        let argumentos = [];
        let temp = instruccion;
        while(temp!="Epsilon"){
            argumentos.push(procesarExpresionNumerica(temp.expresion, tablaDeSimbolos, ambito));
            temp=temp.siguiente;
        }
        return argumentos;
    }
    function procesarUnicambios(instruccion, tablaDeSimbolos, ambito){
        let principalValue=getPrincipalValue(instruccion, tablaDeSimbolos, ambito);
        if(principalValue.tipo=="number" || principalValue.tipo=="string"){
            if(instruccion.sentencia==SENTENCIAS.INCREMENTO){
                principalValue.valor++;
            }else if(instruccion.sentencia==SENTENCIAS.DECREMENTO){
                principalValue.valor--;
            }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_SUMA){
                let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                if(valor.tipo == "string" ||valor.tipo == "number" ||valor.tipo == "boolean"){
                    principalValue.valor+=valor.valor;
                }else{
                    consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                    throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
                }
            }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_RESTA){
                let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                if(valor.tipo == "string" ||valor.tipo == "number" ||valor.tipo == "boolean"){
                    principalValue.valor+=valor.valor;
                }else{
                    consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                    throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
                }        
            }
        }else{
            consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede usar el operador += con el tipo de dato: ' + principalValue.tipo+'\n';  
            throw '>ERROR: Incompatibilidad de tipos: No se puede usar el operador += con el tipo de dato: ' + principalValue.tipo+'\n'; 
        }
        
    }
    function getPrincipalValue(instruccion, tablaDeSimbolos,ambito){
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        if(principalValue.var_type==TIPO_VARIABLE.CONST && instruccion.id.acc=="Epsilon"){
            consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';  
            throw '>ERROR:  No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';   
        }
        let temp = instruccion.id.acc;
        let side="right";
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                    }
                }
                side="both";
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }/*
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n';             
                }*/
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                side="both"
            }else {
                consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';  
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
        }
        return principalValue;
    }
    //SENTENCIAS DE CONTROL 
    function procesarIf(instruccion, tablaDeSimbolos, ambito) {
        const logica = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        if (logica.valor) {
            const tsIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
            let returnedAcction = procesarBloque(instruccion.accion, tsIf, ambito);
            if(returnedAcction!=undefined){
                return returnedAcction;
            }
        } else {
            if (instruccion.else != "Epsilon") {
                if (instruccion.else.sentencia === SENTENCIAS.ELSE_IF) {
                    const tsElIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarIf(instruccion.else, tsElIf, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } else {
                    const tsElse = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarBloque(instruccion.else.accion, tsElse, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                }
            }
        }
    
    }
    function procesarFor(instruccion, tablaDeSimbolos, ambito) {
        procesarBloque([instruccion.inicial], tablaDeSimbolos, ambito);
        let instruccionID = instruccion.inicial.sentencia==SENTENCIAS.ASIGNACION?instruccion.inicial.id.id:instruccion.inicial.id;
        const valor = procesarExpresionNumerica(instruccion.inicial.expresion, tablaDeSimbolos, ambito);
        tablaDeSimbolos.actualizar(instruccionID, valor);//, SplitAmbitos(ambito)
        if (instruccion.paso.paso == "++") {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccionID, { valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).valor) + 1, tipo: tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                        continue;
                    }else{
                        return returnedAcction;
                    } 
                }                
            }
        } else if (instruccion.paso.paso == "--") {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccionID, { valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).valor) - 1, tipo: tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                }
            }
        } else {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccionID, { valor: Number(procesarExpresionNumerica(instruccion.paso.paso, tablaDeSimbolos, ambito).valor), tipo: tablaDeSimbolos.obtenerSimbolo(instruccionID, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                }
            }
    
        }
    
    }
    function procesarForOF(instruccion, tablaDeSimbolos, ambito){
        let conjunto = procesarAccID(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(!Array.isArray(conjunto.valor)){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "infer",  "undefined", ambito, "temp", "temp");
        for(let val of conjunto.valor){
            tablaDeSimbolos.actualizarAndType(instruccion.variable, val);
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarForIn(instruccion, tablaDeSimbolos, ambito){
        let conjunto = procesarAccID(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(!Array.isArray(conjunto.valor)){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "infer",  "undefined", ambito, "temp", "temp");
        for(let val in conjunto.valor){
            tablaDeSimbolos.actualizarAndType(instruccion.variable, {valor:val, tipo:"number"});
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarWhile(instruccion ,tablaDeSimbolos, ambito){
        while(procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito).valor){
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarDoWhile(instruccion ,tablaDeSimbolos, ambito){
        do{
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }while(procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito).valor);
    }
    function procesarSwitch(instruccion, tablaDeSimbolos, ambito){
        let cases =  getCases(instruccion.cases);
        for(let i = 0;i<cases.length;i++){
            if(cases[i].logica=="default"){
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction = procesarBloque(cases[i].accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                } 
                break;
            }else{
                let original = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
                let caso= procesarExpresionNumerica(cases[i].logica, tablaDeSimbolos, ambito);
                let returnedAcction;
                if(original.valor==caso.valor){
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                    for(let e =i;e<cases.length;e++){
                        returnedAcction = procesarBloque(cases[e].accion, tsFor, ambito);
                        if(returnedAcction!=undefined){
                            if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                                break;
                            }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                                continue;
                            }else{
                                return returnedAcction;
                            } 
                        } 
                    }
                    i=cases.length; 
                    if(returnedAcction!=undefined){
                        if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                        }else{
                            return returnedAcction;
                        } 
                    }                  
                }
            }
        }
    }
    function getCases(cases){
        let arreglo = [];
        let temp=cases;
        while(temp!="Epsilon"){
            arreglo.push(temp);
            temp=temp.next_case;
            if(temp.logica=="default"){
                arreglo.push(temp);
                break;
            }
        }
        return arreglo;
    }
    //Graficar TS
    function graficar_Ts(tablaDeSimbolos, ambito){
        let tabla = document.createElement("table");
        tabla.bgColor= '#bbe1fa';
        tabla.align="center";
        tabla.width="80%";
        tabla.border="1px solid black";
        var row0 =  tabla.insertRow( tabla.rows.length);
        var celda01 = row0.insertCell(0);
        var celda02 = row0.insertCell(1);
        var celda03 = row0.insertCell(2);
        var celda04 = row0.insertCell(3);
        var celda05 = row0.insertCell(4);
        var celda06 = row0.insertCell(5);
        var celda07 = row0.insertCell(6);
        var celda08 = row0.insertCell(7);
        celda01.innerHTML = "No.";
        celda01.bgColor="#40a8c4";
        celda02.innerHTML = "Sentencia";
        celda02.bgColor="#40a8c4";
        celda03.innerHTML = "ID";
        celda03.bgColor="#40a8c4";
        celda04.innerHTML = "Tipo";
        celda04.bgColor="#40a8c4";
        celda05.innerHTML = "Valor";
        celda05.bgColor="#40a8c4";
        celda06.innerHTML = "Fila";
        celda06.bgColor="#40a8c4";
        celda07.innerHTML = "Columna";
        celda07.bgColor="#40a8c4";
        celda08.innerHTML = "Ambito";
        celda08.bgColor="#40a8c4";
      if(tablaDeSimbolos._simbolos.length!=0){
        let i=0;
        for(let simbolo of tablaDeSimbolos._simbolos) {
        if(simbolo.si=="variable"){
        i++;
          var row = tabla.insertRow( tabla.rows.length);
          var celda1 = row.insertCell(0);
          var celda2 = row.insertCell(1);
          var celda3 = row.insertCell(2);
          var celda4 = row.insertCell(3);
          var celda5 = row.insertCell(4);
          var celda6 = row.insertCell(5);
          var celda7 = row.insertCell(6);
          var celda8 = row.insertCell(7);
          celda1.innerHTML = i;
          celda2.innerHTML = simbolo.si;
          celda3.innerHTML = simbolo.id;
          celda4.innerHTML = simbolo.tipo;
          celda5.innerHTML = toString({valor:simbolo.valor,tipo:simbolo.tipo}, tablaDeSimbolos, ambito);
          celda6.innerHTML = simbolo.fila;
          celda7.innerHTML = simbolo.columna;
          celda8.innerHTML = simbolo.ambito;
        }
        }
      }
      tablero.appendChild(tabla);
    }
    function nuevoTemporal(){
        contadores.temporales++;
        return "t"+contadores.temporales;
    }
    function nuevaEtiqueta(){
        contadores.etiquetas++;
        return "L"+contadores.etiquetas;
    }
    function stackPush(){
        pilas.stack++;
        return pilas.stack-1;
    }
    function heapPush(){
        pilas.heap++;
        return pilas.heap-1;
    }
    function printTemporales(){
        let txt ="";
        for(let i = 1;i<=contadores.temporales;i++){
            txt+="t"+i;
            txt+=(i<contadores.temporales)?",":";\n";
        }
        return txt;
    }
}