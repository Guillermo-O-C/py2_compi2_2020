import { ThumbUpAltSharp } from "@material-ui/icons";
import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR, TIPO_ACCESO } from "./instrucciones";

export default function Traucir(salida, consola, traduccion, printedTable, tablero){
    const contadores = {temporales:4, etiquetas:0};
    const arreglos = {uno:0, dos:0, tres:0, cuatro:0, cinco:0};
   //const arreglos = [];
    const pilas = {stack:0, heap:0};
    const stack = [], heap=[];
   let functionDeclaration="", funcionesTraducidas=[];
   printedTable.erEj=salida.ErrArr;
   const tsGlobal = new TS([], printedTable);
   const FuncionesC3D = [];
   try {
       consola.value="";
        setSalida(salida.Errores);       
        scanForTypes(salida.AST, tsGlobal); 
        scanForFunctions(salida.AST, tsGlobal, "Global");
        consola.value="";
        procesarBloque(salida.AST, tsGlobal, "Global");
        let mainContent = consola.value;
        FuncionesC3D.push({id:"main", c3d:mainContent});
        mainContent="void main()\n{\n"+ mainContent;
        consola.value="";
        //importFunctions(salida.AST, tsGlobal, "Global");
        importFunctions();
        consola.value="#include <stdio.h> //Importar para el uso de Printf\n#include <math.h>//Importa fmod\ndouble heap[10000000]; //Estructura para heap\ndouble stack[16394]; //Estructura para stack\ndouble p; //Puntero P\ndouble h; //Puntero H\ndouble "+printTemporales()+funcionesNativas()+functionDeclaration+ mainContent+"\nreturn;\n}\n";
        //traduccion.setValue(output);
        console.log(tsGlobal._simbolos);
        //console.log(FuncionesC3D)
        sendTable(tsGlobal);
    } catch (e) {
        console.error(e);
        return;
    }
    function procesarBloque(instrucciones, tablaDeSimbolos, ambito, inicio, falso, retorno){
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
                    procesarImpresion(instruccion.valor, tablaDeSimbolos, ambito);
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
                    let returnedAcction = procesarIf(instruccion, tablaDeSimbolos, ambito, inicio, falso, retorno);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                    let returnedAcction = procesarFor(instruccion, tsFor, ambito, retorno);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_OF) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                    let returnedAcction = procesarForOF(instruccion, tsFor, ambito, retorno);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_IN) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                    let returnedAcction = procesarForIn(instruccion, tsFor, ambito, retorno);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.WHILE) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                    let returnedAcction = procesarWhile(instruccion, tsFor, ambito, retorno);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if (instruccion.sentencia === SENTENCIAS.DO_WHILE) {
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                    let returnedAcction = procesarDoWhile(instruccion, tsFor, ambito, retorno);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                        console.error(e);
                    }
            }else if(instruccion.sentencia === SENTENCIAS.LLAMADA){ 
                try{
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);               
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
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);               
                    let returnedAcction =  procesarSwitch(instruccion, tsFor, ambito, retorno);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.BREAK){
                if(falso==undefined){
                    printedTable.erEj.push({descripcion:'break fuera de ciclo.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw 'break fuera de ciclo.';         
                }
                consola.value+=("goto "+falso+";\n");
            }else if(instruccion.sentencia===SENTENCIAS.CONTINUE){
                if(inicio==undefined){
                    printedTable.erEj.push({descripcion:'continue fuera de ciclo.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw 'continue fuera de ciclo.';         
                }
                consola.value+=("goto "+inicio+";\n");
            }else if(instruccion.sentencia===SENTENCIAS.RETURN){
                try{
                    if(ambito=="Global"){
                        printedTable.erEj.push({descripcion:'Return fuera de función.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                        throw '>ERROR: Return fuera de función.'; 
                    }
                    if(instruccion.valor=="Epsilon"){
                        //no devuelvo nada porque es un return sin valor
                        //consola.value+="stack[(int)p]=0;";
                        consola.value+="goto "+retorno+";\n";
                    }else{
                        let valor=procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                        consola.value+="stack[(int)p]="+valor.valor+";\n";
                        consola.value+="goto "+retorno+";\n";
                    }
                } catch (e) {
                    console.error(e);
                }
            }else if(instruccion.sentencia===SENTENCIAS.GRAFICAR_TS){
                try{
                    const tsFor = new TS(JSON.parse(JSON.stringify(tablaDeSimbolos.simbolos)), printedTable);  
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
                            let dataType = LowerCase(procesarDataType(instruccion.tipo));
                            if(tablaDeSimbolos.existe(dataType.split("[]")[0], undefined, "type")==false && dataType.split("[]")[0]!="number" && dataType.split("[]")[0]!="string"&& dataType.split("[]")[0]!="void" && dataType.split("[]")[0]!="boolean"){
                                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+'\n>ERROR: Type '+dataType.split("[]")[0]+' no ha sido definido y es el tipo de retorno de la función:'+instruccion.id;  
                                throw '>ERROR: Type '+dataType.split("[]")[0]+' no ha sido definido y es el tipo de retorno de la función:'+instruccion.id;  
                            }
                            tablaDeSimbolos.agregarFuncion(instruccion.id, procesarDataType(instruccion.tipo), procesarParametros(instruccion.parametros), instruccion.accion, ambito, instruccion.fila, instruccion.columna);
                            //traducirFunciones(instruccion.id,new TS(JSON.parse(JSON.stringify(tablaDeSimbolos._simbolos)), consola), ambito);
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
                tablaDeSimbolos.agregarType(LowerCase(instruccion.id), procesarAtributos(instruccion.atributos), instruccion.fila, instruccion.columna);
            }
        }
    }
    function procesarAtributos(atributos){
        let tempAtributos = [];
        let temp = atributos;
        while(temp!="Epsilon"){
            tempAtributos.push({id:LowerCase(temp.id), tipo: LowerCase(procesarDataType(temp.data_type))});
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
        return data_description.tipo.toLowerCase()+dimension;
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
            return tipo.toLowerCase();
        }
    }
    function procesarParametros(parametros){
        let temporal=[];
        let temp = parametros;
        while(temp!="Epsilon"){
            temporal.push({id:LowerCase(temp.id), tipo: LowerCase(procesarDataType(temp.tipo))});
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
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        if(principalValue.var_type==TIPO_VARIABLE.CONST && instruccion.id.acc=="Epsilon"){
            printedTable.erEj.push({descripcion:'No se puede asignar a ' + instruccion.id.id+' porque es una constante.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna, ambito:ambito}); 
            throw '>ERROR:  No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';   
        }
        let assignedValue = procesarExpresionNumerica(instruccion.expresion, tablaDeSimbolos, ambito, principalValue.tipo);
        if(String(assignedValue.valor).match(/(<|<=|>|>=|!=|==)/)!=null && assignedValue.tipo=="boolean"){
            let temp = nuevoTemporal();
            consola.value+=temp+"="+assignedValue.valor+";\n";
            assignedValue.valor=temp;
        }
        let temp = instruccion.id.acc, tipo =principalValue.tipo, direcciones=principalValue.direcciones, pila, bandera=false;
        if(ambito=="Global"||principalValue.ambito=="Global"/*&&principalValue.tipo=="number"||principalValue.ambito=="Global"&&principalValue.tipo=="boolean"*/){
            pila="heap";
        }else{
            pila="stack";
        }
        if(pila=="stack" && temp !="Epsilon" && tipo!="number" && tipo!="boolean"){
            let temporal = nuevoTemporal(), temporal2=nuevoTemporal();
            consola.value+=temporal+"=stack[(int)"+direcciones+"];\n";//dirección en el heap
            //consola.value+=temporal2+"=heap[(int)"+temporal+"];\n";
            direcciones=temporal;
        }
        while(temp!="Epsilon"){
            bandera=true;//indica que el cambio es en el heap
            pila="heap";//se direcciona a el heap porque procede de un objeto o un array
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    printedTable.erEj.push({descripcion:' No existe el atributo '+temp.atributo,tipo:"semántico", linea:temp.fila, columna:temp.columna, ambito:ambito}); 
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                /*for(let attribute of principalValue.direcciones){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute;
                        tipo = value.valor.tipo;
                        direcciones=attribute.direcciones;
                    }
                }*/
                let temporal1=nuevoTemporal(); 
                consola.value+=temporal1+"="+direcciones+"+"+(value.posicion)+";\n";
                direcciones=temporal1;
                tipo=value.valor.tipo;
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(principalValue.tipo.split("[]")==1){
                    //onsola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    printedTable.erEj.push({descripcion:'Intento de acceso a posición de array inexistente',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';
                    printedTable.erEj.push({descripcion:'No se reconoce la expresion '+valor.valor+' como un index',tipo:"semántico", linea:temp.fila, columna:temp.columna, ambito:ambito});
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                let tempTipo="";
                for(let e =0;e<tipo.split("[]").length-1;e++){
                    if(e==0)tempTipo+=tipo.split("[]")[e];
                    else tempTipo+="[]";
                }
                tipo=tempTipo;
                let suma = nuevoTemporal(), temporal = nuevoTemporal();
                consola.value+=suma+"="+valor.valor+"+1;\n";
                consola.value+=temporal+"="+direcciones+"+"+suma+";\n";
                direcciones=temporal; 
                if(temp.next_acc!="Epsilon"){
                    let temporal2 = nuevoTemporal();
                    consola.value+=temporal2+"= heap[(int)"+temporal+"];\n";
                    direcciones=temporal2;
                }
            }else {
                //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n'; 
                printedTable.erEj.push({descripcion:'No se puede asignar esta accion en esta asignación: '+temp,tipo:"semántico", linea:temp.fila, columna:temp.columna, ambito:ambito}); 
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
            
        }
        if(assignedValue.tipo.split("_")[0]=="newArray"){
            assignedValue.tipo=tipo;
        }
        if(tipo==assignedValue.tipo || tipo.split("[]").length==assignedValue.tipo.split("[]").length && assignedValue.tipo.split("[]")[0]=="undefined"){
            //la segunda condición es para ver si se le asigno un [] vacío
            if(tipo=="number"||tipo=="boolean"){
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"=heap[(int)"+principalValue.valor+"];\n";
                consola.value+=pila+"[(int)"+direcciones+"]="+assignedValue.valor+";\n";
            }else{
                if(principalValue.tipo==assignedValue.tipo){
                    if(tipo=="string"){
                        if(principalValue.ambito!="Global"){
                            consola.value+="stack[(int)"+principalValue.direcciones+"]="+assignedValue.valor+";\n";
                        }else{
                            consola.value+=principalValue.direcciones+"="+assignedValue.valor+";\n";
                        }
                    }else{
                        if(principalValue.ambito!="Global"){
                           //consola.value+="stack[(int)"+principalValue.direcciones+"]="+assignedValue.valor+";\n";
                           if(bandera){//para saber si es de cambiar un atributo e el heap o una posicion.
                                consola.value+="heap[(int)"+direcciones+"]="+assignedValue.valor+";\n";
                           }else{
                                //consola.value+="stack[(int)"+principalValue.direcciones+"]="+assignedValue.valor+";\n";
                                consola.value+="stack[(int)"+direcciones+"]="+assignedValue.valor+";\n";
                           }
                        }else{
                            consola.value+=principalValue.direcciones+"="+assignedValue.valor+";\n";
                        }
                    }
                }else{
                    consola.value+="heap[(int)"+direcciones+"]="+assignedValue.valor+";\n";
                }
            }
        }else{
               // principalValue.valor=assignedValue.valor;}else
                //consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';  
                printedTable.erEj.push({descripcion:'Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue,tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna, ambito:ambito}); 
                throw '>ERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';                
        }
    }
    function procesarImpresion(expresion, tablaDeSimbolos, ambito){
        const valores = procesarTexto(expresion, tablaDeSimbolos, ambito);
        consola.value+=toString(valores);
        consola.value+="printf(\"\\n\");\n";
    }
    function procesarTexto(expresion, tablaDeSimbolos, ambito, userType, verdadero, falso){
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
            if(tablaDeSimbolos.obtenerFuncion(expresion.id, expresion.fila, expresion.columna, ambito).tipo=="void"){
                //consola.value+='>f:'+expresion.fila+', c:'+expresion.columna+', ambito:'+ambito+'\nERROR: Función de tipo void como expresión.\n';  
                printedTable.erEj.push({descripcion:' Función de tipo void como expresión.',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: Función de tipo void como expresión.'; 
            }
            const valor = procesarLlamada(expresion, tablaDeSimbolos, ambito);
            //let temporal = nuevoTemporal();
            //consola.value+=temporal+"="+valor.valor+";\n";
            return {valor:[{valor:valor.valor,tipo:valor.tipo}], tipo:valor.tipo};
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            
            if(valor.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=-"+valor.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"number"}],tipo:"number", direcciones:temporal};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta unitaria con el tipo '+valor.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta unitaria con el tipo.'; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"+"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal, tipo:"number"}],tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"+"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal, tipo:"number"}],tipo:"number"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor[0].valor+";\n";
                consola.value+="t3="+valorDer.valor[0].valor+";\n";
                consola.value+="conStrNum();\n";
                return {valor:[{valor:temporal,tipo:"string"}],tipo:"string"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"+"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"number"}],tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorDer.valor[0].valor+";\n";
                consola.value+="t3="+valorIzq.valor[0].valor+";\n";
                consola.value+="conNumStr();\n";
                return {valor:[{valor:temporal,tipo:"string"}],tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor[0].valor+";\n";
                consola.value+="t3="+valorDer.valor[0].valor+";\n";
                consola.value+="concatenar();\n";
                return {valor:[{valor:temporal,tipo:"string"}],tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor[0].valor+";\n";
                consola.value+="t3="+valorDer.valor[0].valor+";\n";
                consola.value+="conStrBool();\n";
                return {valor:[{valor:temporal,tipo:"string"}],tipo:"string"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorDer.valor[0].valor+";\n";
                consola.value+="t3="+valorIzq.valor[0].valor+";\n";
                consola.value+="conBoolStr();\n";
                return {valor:[{valor:temporal,tipo:"string"}],tipo:"string"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
                const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
                const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"-"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"number"}],tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"*"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"number"}],tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                if (valorDer.valor[0].valor == 0){
                    printedTable.erEj.push({descripcion:' división entre 0 no está definida',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                    throw 'Error: división entre 0 no está definida.';
                }             
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"/"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"number"}],tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+="t0="+valorIzq.valor[0].valor+";\n";
                consola.value+="t3="+valorIzq.valor[0].valor+";\n";
                consola.value+="t1="+valorDer.valor[0].valor+";\n";
                consola.value+="potencia();\n";
                consola.value+=temporal+"=t0;\n";
                return {valor:[{valor:temporal, tipo:"number"}],tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=fmod("+valorIzq.valor[0].valor+","+valorDer.valor[0].valor+");\n";
                return {valor:[{valor:temporal,tipo:"number"}],tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+">"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+">="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"<"+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor que  con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"<="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(String(valorIzq.valor[0].valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+";\n";
                valorIzq.valor=temporal;
            }
            if(String(valorDer.valor[0].valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorDer.valor[0].valor+";\n";
                valorDer.valor=temporal;
            }
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+="t0="+valorIzq.valor[0].valor+";\nt1="+valorDer.valor[0].valor+";\n";
                consola.value+="compareStrs();\n";
                consola.value+=temporal+"=t2;\n"
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type")){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type") ){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo.split("[]").length>1  && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo.split("[]").length>1 ){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo=="string"  && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo=="string" ){/*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */  && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"=="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(String(valorIzq.valor[0].valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+";\n";
                valorIzq.valor=temporal;
            }
            if(String(valorDer.valor[0].valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorDer.valor[0].valor+";\n";
                valorDer.valor=temporal;
            }
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
               /* let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+="t0="+valorIzq.valor[0].valor+";\nt1="+valorDer.valor[0].valor+";\n";
                consola.value+="diffStrs();\n";
                consola.value+=temporal+"=t2;\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type")){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo.split("[]").length>1 && valorDer.tipo.split("[]").length>1){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type") ){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo.split("[]").length>1  && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo.split("[]").length>1 ){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if(valorIzq.tipo=="string"  && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo=="string" ){
                /* let temporal = nuevoTemporal();
                 consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                 return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                 return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else if( valorIzq.valor[0].valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */  && valorDer.valor[0].valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /* let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor+";\n";
                return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};*/
                return {valor:[{valor:valorIzq.valor[0].valor+"!="+valorDer.valor[0].valor,tipo:"boolean"}],tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            let segundaCondicion = nuevaEtiqueta();
            let tempVerdadero, tempFalso;
            if(verdadero==undefined && falso == undefined){
                tempVerdadero= nuevaEtiqueta();
                tempFalso = nuevaEtiqueta();
            }else{
                tempVerdadero= verdadero;
                tempFalso=falso;
            }
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito, undefined, segundaCondicion, tempFalso);
            let tempStr = consola.value;
            consola.value="";
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito, undefined, tempVerdadero, tempFalso);
            let RigthDec = consola.value;
            consola.value=tempStr;
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                if(verdadero==undefined && falso == undefined){
                    let temporal = nuevoTemporal(), final = nuevaEtiqueta();
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorIzq.valor[0].valor+") goto "+segundaCondicion+";\n";
                        consola.value+="goto "+tempFalso+";\n";
                    }
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor[0].valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+tempFalso+";\n";
                    }
                    consola.value+=tempVerdadero+":\n"
                    consola.value+=temporal+"=1;\n";
                    consola.value+="goto "+final+";\n";
                    consola.value+=tempFalso+":\n"
                    consola.value+=temporal+"=0;\n";
                    consola.value+=final+":\n"
                    return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
                }else{
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                    consola.value+="if("+valorIzq.valor[0].valor+") goto "+segundaCondicion+";\n";
                    consola.value+="goto "+falso+";\n";
                    }
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor[0].valor+") goto "+verdadero+";\n";
                        consola.value+="goto "+falso+";\n";
                    }
                    return {verdadero:verdadero, falso:falso,tipo:"boolean"};
                }
                
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
                let segundaCondicion = nuevaEtiqueta();
                let tempVerdadero, tempFalso;
                if(verdadero==undefined && falso == undefined){
                    tempVerdadero= nuevaEtiqueta();
                    tempFalso = nuevaEtiqueta();
                }else{
                    tempVerdadero= verdadero;
                    tempFalso=falso;
                }
                const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito, undefined, tempVerdadero, segundaCondicion);
                let tempStr = consola.value;
                consola.value="";
                const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito, undefined, tempVerdadero, tempFalso);
                let RigthDec = consola.value;
                consola.value=tempStr;
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                if(verdadero==undefined && falso == undefined){
                    let temporal = nuevoTemporal(), final = nuevaEtiqueta();
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorIzq.valor[0].valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+segundaCondicion+";\n"
                    } 
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor[0].valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+tempFalso+";\n";
                    }
                    consola.value+=tempVerdadero+":\n";
                    consola.value+=temporal+"=1;\n";
                    consola.value+="goto "+final+";\n";
                    consola.value+=tempFalso+":\n";
                    consola.value+=temporal+"=0;\n";
                    consola.value+=final+":\n";
                    return {valor:[{valor:temporal,tipo:"boolean"}],tipo:"boolean"};
                }else{
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorIzq.valor[0].valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+segundaCondicion+";\n";
                    }
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor[0].valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+falso+";\n";
                    }
                    return {verdadero:verdadero, falso:falso,tipo:"boolean"};
                }                
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            let tempVerdadero, tempFalso;
            if(verdadero==undefined && falso == undefined){
                tempVerdadero= nuevaEtiqueta();
                tempFalso = nuevaEtiqueta();
            }else{
                tempVerdadero= verdadero;
                tempFalso=falso;
            }
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito, undefined, tempFalso, tempVerdadero);
            if(valorIzq.tipo=="boolean"){
                if(verdadero==undefined && falso == undefined){
                    let pos_temp=nuevoTemporal(), final = nuevaEtiqueta();
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT&&expresion.operandoIzq.tipo!=TIPO_OPERACION.OR){
                        consola.value+="if("+valorIzq.valor+") goto "+tempFalso+";\n";
                        consola.value+="goto "+tempVerdadero+";\n";
                    }
                    consola.value+=tempVerdadero+":\n";
                    consola.value+=pos_temp+"=1;\n";
                    consola.value+="goto "+final+";\n";
                    consola.value+=tempFalso+":\n";
                    consola.value+=pos_temp+"=0;\n";
                    consola.value+=final+":\n";
                    return {valor:pos_temp,tipo:"boolean"};
                }else{
                    return {verdadero:verdadero, falso:falso,tipo:"boolean"};            
                }
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo; 
            }
        } else if(expresion.tipo ==  TIPO_OPERACION.CONCATENACION){
            const valorIzq = procesarTexto(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarTexto(expresion.operandoDer, tablaDeSimbolos, ambito);
            return {valor:[valorIzq, valorDer], tipo:"concatenacion"};
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return {valor:[{valor:expresion.valor, tipo:"number"}], tipo:"number"};
        } else if (expresion.tipo === TIPO_VALOR.DECIMAL) {
            return {valor:[{valor:expresion.valor, tipo:"number"}], tipo:"number"};
        } else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return {valor:[{valor:"1", tipo:"boolean"}], tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return {valor:[{valor:"0", tipo:"boolean"}], tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: [{ valor: "0", tipo: undefined}], tipo: undefined};
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            const valIzq=procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
            return  {valor:[valIzq], tipo:valIzq.tipo};
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            heapPush();
            let principalValue = {valor:initial, tipo: "string", direcciones:initial};
            strMethods(principalValue, expresion.next_acc, tablaDeSimbolos, ambito);
            return {valor:[{valor:principalValue.valor, tipo: principalValue.tipo, direcciones:principalValue.valor}], tipo: principalValue.tipo, direcciones:principalValue.valor};
        } else if (expresion.tipo === TIPO_VALOR.CADENA_CHARS) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            heapPush();
            let principalValue = {valor:initial, tipo: "string", direcciones:initial};
            strMethods(principalValue, expresion.next_acc, tablaDeSimbolos, ambito);
            return {valor:[{valor:principalValue.valor, tipo: principalValue.tipo, direcciones:principalValue.valor}], tipo: principalValue.tipo, direcciones:principalValue.valor};
        } else if(expresion.tipo===TIPO_DATO.OPERADOR_TERNARIO){
            let verdadero=nuevaEtiqueta(), falso=nuevaEtiqueta(), logica =  procesarTexto(expresion.logica, tablaDeSimbolos, ambito, undefined, verdadero, falso);
            if(logica.tipo=="boolean"){
                let temporal = nuevoTemporal(), verdadero=nuevaEtiqueta(), falso=nuevaEtiqueta(), final=nuevaEtiqueta();
                if(expresion.tipo!=TIPO_OPERACION.AND||expresion.tipo!=TIPO_OPERACION.OR||expresion.tipo!=TIPO_OPERACION.NOT){
                    consola.value+="if("+logica.valor[0].valor+") goto "+verdadero+";\n";
                    consola.value+="goto "+falso+";\n";
                }                
                consola.value+=verdadero+":\n";
                let valorVerdadero=procesarTexto(expresion.result1, tablaDeSimbolos, ambito);
                consola.value+=temporal+"="+valorVerdadero.valor[0].valor+";\n";
                consola.value+="goto "+final+";\n";
                consola.value+=falso+":\n";
                let valorFalso =procesarTexto(expresion.result2, tablaDeSimbolos, ambito);
                consola.value+=temporal+"="+valorFalso.valor[0].valor+";\n";
                consola.value+=final+":\n";
                if(valorVerdadero.tipo.toLowerCase() != valorFalso.tipo.toLowerCase()){
                    printedTable.erEj.push({descripcion:'Ambos resultados del ternario deben ser del mismo tipo:'+valorVerdadero.tipo+','+valorFalso.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                    throw '>ERROR:Ambos resultados del ternario deben ser del mismo tipo:'+valorVerdadero.tipo+','+valorFalso.tipo; 
                }
                return {valor:[{valor:temporal, tipo:valorVerdadero.tipo}], tipo:valorVerdadero.tipo};
            }
        } else {
            printedTable.erEj.push({descripcion:'expresión no válida: ' + expresion.valor[0].valor,ambito:ambito,tipo:"semántico", linea:"temp", columna:"temp", ambito:ambito});
            throw 'ERROR: expresión no válida: ' + expresion.valor[0].valor;
        }
    }
    function toString(cadena, tablaDeSimbolos, ambito){
        let text= "";
        if(Array.isArray(cadena.valor)){
            text+=toString(cadena.valor, tablaDeSimbolos, ambito);
        }else{
                for(let elem of cadena){
                if(Array.isArray(elem.valor)){
                    text+=toString(elem.valor, tablaDeSimbolos, ambito);
                }else if(elem.tipo=="number"){
                    if(typeof elem.valor === 'number'){
                        if(elem.valor%1===0){
                            text+="printf(\"%d\", (int)"+elem.valor+");\n"; 
                        }else{
                           text+="printf(\"%f\", (double)"+elem.valor+");\n"; 
                        }
                    }else {
                        text+="printf(\"%f\", "+elem.valor+");\n";
                    }              
                }else if(elem.tipo=="boolean"){
                    text+="t3="+elem.valor+";\nboolToStr();\n";
                }else if(elem.tipo=="string"){
                    text+="t0="+elem.valor+";\nimprimir();\n";
                }
            } 
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
        let addTemp = (valor.tipo!=TIPO_OPERACION.AND &&valor.tipo!=TIPO_OPERACION.OR &&valor.tipo!=TIPO_OPERACION.NOT)?true:false;
        consola.value+="//comienza declaracion de variable "+id+"\n";
        //Verificar que exista el tipo de dato de la variable
        data_type=LowerCase(procesarDataType(data_type));  //establece el tipo de la variable que es obligatorio declarar
        if(!tablaDeSimbolos.existe(data_type.split("[]")[0], undefined, "type") && data_type.split("[]")[0]!="number" && data_type.split("[]")[0]!="string" && data_type.split("[]")[0]!="boolean"){
            //consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: No existe el tipo de dato:'+data_type.split("[]")[0]+'.\n';  
            printedTable.erEj.push({descripcion:'No existe el tipo de dato:'+data_type.split("[]")[0]+'.',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR: No existe el tipo de dato:'+data_type.split("[]")[0]+'.'; 
        }
        //Verificar que no exista en el mismo ámbito
        if(tablaDeSimbolos.existe(id, ambito, "variable")){
            //consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito.\n';  
            printedTable.erEj.push({descripcion:'El identificador:\"'+id+'\" ya ha sido declarado en este ámbito',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito'; 
        }
        //Ver que el tipo de símbolo sea el correcto con el del valor o undefined
        if(var_type==TIPO_VARIABLE.CONST && valor == "undefined"){
            //consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: La delcaracion de la constante '+id+' debe ser inicializada.\n';  
            printedTable.erEj.push({descripcion:'La delcaracion de  la constante '+id+' debe ser inicializada.\n',tipo:"semántico", linea:fila, columna:columna,ambito:ambito});
            throw '>ERROR:La delcaracion de  la constante '+id+' debe ser inicializada.\n';             
        }
        //let heapInit = pilas.heap;
        if(valor!="undefined"){
            valor=procesarExpresionNumerica(valor, tablaDeSimbolos, ambito, data_type);
            if(valor.tipo.split("_")[0]=="newArray" && data_type.split("[]").length>1){
                valor.tipo=data_type;
            }
            if(valor.tipo=="number"||valor.tipo=="boolean"){
                //valor.direcciones=pilas.heap;
                let pila = (ambito=="Global")?"heap":"stack", puntero=(ambito=="Global")?"h":"p";
            //    if(valor.reference==true){
                    //let temp = nuevoTemporal();
                    /*valor.direcciones=nuevoTemporal();
                    consola.value+=valor.direcciones+"=h;\nh=h+1;\n";
                    consola.value+=temp+"=heap[(int)"+valor.valor+"];\nheap[(int)"+valor.direcciones+"]="+temp+";\n";*/
                    valor.direcciones=nuevoTemporal();
                    consola.value+=valor.direcciones+"="+puntero+";\n";
                    consola.value+=puntero+"="+puntero+"+1;\n";
                    //consola.value+=temp+"="+valor.valor+";\n";
                    //consola.value+=valor.direcciones+"=h;\n";
                    if(valor.tipo=="boolean" && addTemp){
                        let temp = nuevoTemporal();
                        consola.value+=temp+"="+valor.valor+";\n";
                        valor.valor=temp;
                    }
                    consola.value+=pila+"[(int)"+valor.direcciones+"]="+valor.valor+";\n";
              /*  }else{
                    valor.direcciones=nuevoTemporal();
                    consola.value+=valor.direcciones+"=h;\n";
                    consola.value+="heap[(int)"+valor.direcciones+"]="+valor.valor+";\nh=h+1;\n";
                }
                heapPush();*/
            }
            if(valor.reference && valor.tipo!="number" && valor.tipo !="boolean"){
                //heapInit=valor.valor;
                valor.direcciones=valor.valor;
                if(valor.tipo=="string"){
                    let temporal = nuevoTemporal();
                    consola.value+=temporal+"="+valor.valor+";\n";
                    valor.valor=temporal;
                }
            }
        }else{
            let pila = (ambito=="Global")?"heap":"stack", puntero=(ambito=="Global")?"h":"p";
            if(data_type=="number"){
                let temporal = nuevoTemporal();
                valor={tipo:"number", direcciones:temporal, valor:temporal};
                consola.value+=valor.direcciones+"="+puntero+";\n"
                consola.value+=pila+"[(int)"+valor.direcciones+"]=0;\n"+puntero+"="+puntero+"+1;";
            }else if(data_type=="boolean"){
                let temporal = nuevoTemporal();
                valor={tipo:"boolean", direcciones:temporal, valor:temporal};
                consola.value+=valor.direcciones+"="+puntero+";\n"
                consola.value+=pila+"[(int)"+valor.direcciones+"]=0;\n"+puntero+"="+puntero+"+1;";
            }else{
                let temporal = nuevoTemporal();
                valor={tipo:data_type, direcciones:temporal, valor:temporal};
                consola.value+=valor.direcciones+"=h;\n"
                consola.value+="heap[(int)"+valor.direcciones+"]=0;\nh=h+1;\n";
            }
        }
        if(data_type!=valor.tipo){  //se descarta la inferencia de tipos
            //consola.value+='f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type+".\n";
            printedTable.erEj.push({descripcion:'Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type,ambito:ambito,tipo:"semántico", linea:fila, columna:columna});
            throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type;
        }
        //Crear simbolo
        if(valor.tipo.split("[]").length>1 || tablaDeSimbolos.existe(valor.tipo.split("[]")[0], undefined, "type") || ambito=="Global" || valor.tipo=="string"){
            //se va  al heap            
            if(valor.tipo=="string"){
                if(ambito!="Global"){//para guardar la referencia en el stack
                    let temporal = nuevoTemporal();
                    consola.value+=temporal+"=p;\np=p+1;\n";
                    consola.value+="stack[(int)"+temporal+"]="+valor.valor+";\n";
                    valor.valor=temporal;
                }
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, valor.valor);
            }else if(valor.tipo.split("[]").length>1){
                if(ambito!="Global"){
                   let temporal = nuevoTemporal();
                    consola.value+=temporal+"=p;\np=p+1;\n";
                    consola.value+="stack[(int)"+temporal+"]="+valor.valor+";\n";
                    valor.valor=temporal; 
                }                
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, valor.valor);
            }else{
                if(ambito!="Global"&&valor.tipo!="number"&&valor.tipo!="boolean"){
                    let temporal = nuevoTemporal();
                    consola.value+=temporal+"=p;\np=p+1;\n";
                    consola.value+="stack[(int)"+temporal+"]="+valor.valor+";\n";
                    valor.direcciones=temporal; 
                } 
                //consola.value+="heap[(int)h]="+ valor.valor+";\nh=h+1;\n";
                tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, valor.direcciones);
            }
        }else{
            //se va al stack
            //consola.value+="stack[(int)p]="+ valor.valor+";\np=p+1;\n";
            tablaDeSimbolos.agregar(var_type, id, data_type, ambito, fila, columna, valor.direcciones);
        }
        consola.value+="//termina declaracion de variable "+id+"\n";
    }
    function procesarExpresionNumerica(expresion, tablaDeSimbolos, ambito, userType, verdadero, falso) {
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
            if(tablaDeSimbolos.obtenerFuncion(expresion.id, expresion.fila, expresion.columna, ambito).tipo=="void"){
                //consola.value+='>f:'+expresion.fila+', c:'+expresion.columna+', ambito:'+ambito+'\nERROR: Función de tipo void como expresión.\n';  
                printedTable.erEj.push({descripcion:' Función de tipo void como expresión.',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: Función de tipo void como expresión.'; 
            }
            const valor = procesarLlamada(expresion, tablaDeSimbolos, ambito);
            /*if(valor.tipo=="void"){
                //consola.value+='>f:'+expresion.fila+', c:'+expresion.columna+', ambito:'+ambito+'\nERROR: Función de tipo void como expresión.\n';  
                printedTable.erEj.push({descripcion:' Función de tipo void como expresión.',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: Función de tipo void como expresión.'; 
            }*/
            //let temporal = nuevoTemporal();
            //consola.value+=temporal+"="+valor.valor+";\n";
            return {valor:valor.valor,tipo:valor.tipo};
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            if(valor.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=-"+valor.valor+";\n";
                return {valor:temporal,tipo:"number"};  
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta unitaria con el tipo '+valor.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta unitaria con el tipo.'; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor+";\n";
                consola.value+="t3="+valorDer.valor+";\n";
                consola.value+="conStrNum();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"+"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else if(valorIzq.tipo=="number" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorDer.valor+";\n";
                consola.value+="t3="+valorIzq.valor+";\n";
                consola.value+="conNumStr();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor+";\n";
                consola.value+="t3="+valorDer.valor+";\n";
                consola.value+="concatenar();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorIzq.valor+";\n";
                consola.value+="t3="+valorDer.valor+";\n";
                consola.value+="conStrBool();\n";
                return {valor:temporal,tipo:"string"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+valorDer.valor+";\n";
                consola.value+="t3="+valorIzq.valor+";\n";
                consola.value+="conBoolStr();\n";
                return {valor:temporal,tipo:"string"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de suma con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
                const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
                const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"-"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de resta con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"*"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de multiplicación con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                if (valorDer.valor == 0){
                    printedTable.erEj.push({descripcion:' división entre 0 no está definida.',tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                    throw 'Error: división entre 0 no está definida.';
                }                
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"/"+valorDer.valor+";\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de división con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){                
                let temporal = nuevoTemporal();
                consola.value+="t0="+valorIzq.valor+";\n";
                consola.value+="t3="+valorIzq.valor+";\n";
                consola.value+="t1="+valorDer.valor+";\n";
                consola.value+="potencia();\n";
                consola.value+=temporal+"=t0;\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de potencia con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=fmod("+valorIzq.valor+","+valorDer.valor+");\n";
                return {valor:temporal,tipo:"number"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de módulo con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"="+valorIzq.valor+">"+valorDer.valor+";\n";
                //return {valor:temporal,tipo:"boolean"};
                return {valor:valorIzq.valor+">"+valorDer.valor,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"="+valorIzq.valor+">="+valorDer.valor+";\n";
                //return {valor:temporal,tipo:"boolean"};
                return {valor:valorIzq.valor+">="+valorDer.valor,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de mayor o igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){    
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"="+valorIzq.valor+"<"+valorDer.valor+";\n";
                //return {valor:temporal,tipo:"boolean"};
                return {valor:valorIzq.valor+"<"+valorDer.valor,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor que con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor que  con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                //let temporal = nuevoTemporal();
                //consola.value+=temporal+"="+valorIzq.valor+"<="+valorDer.valor+";\n";
                //return {valor:temporal,tipo:"boolean"};
                return {valor:valorIzq.valor+"<="+valorDer.valor,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de menor igual con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(String(valorIzq.valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+";\n";
                valorIzq.valor=temporal;
            }
            if(String(valorDer.valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorDer.valor+";\n";
                valorDer.valor=temporal;
            }
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
               // let temporal = nuevoTemporal();
               // consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
               // return {valor:temporal,tipo:"boolean"};
               return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+="t0="+valorIzq.valor+";\nt1="+valorDer.valor+";\n";
                consola.value+="compareStrs();\n";
                consola.value+=temporal+"=t2;\n"
                return {valor:temporal,tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type") ){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type")){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo.split("[]").length>1 && valorDer.tipo.split("[]").length>1){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo.split("[]").length>1  && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo.split("[]").length>1 ){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo=="string"  && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo=="string" ){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */  && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"=="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"=="+valorDer.valor,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(String(valorIzq.valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+";\n";
                valorIzq.valor=temporal;
            }
            if(String(valorDer.valor).match(/(<|<=|>|>=|!=|==)/g)!=null){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorDer.valor+";\n";
                valorDer.valor=temporal;
            }
            if(valorIzq.tipo=="number" && valorDer.tipo=="number"){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo=="string" && valorDer.tipo=="string"){
                let temporal = nuevoTemporal();
                consola.value+="t0="+valorIzq.valor+";\nt1="+valorDer.valor+";\n";
                consola.value+="diffStrs();\n";
                consola.value+=temporal+"=t2;\n";
                return {valor:temporal,tipo:"boolean"};
            }else if(valorIzq.tipo.split("[]").length>1  && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo.split("[]").length>1 ){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo=="string"  && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && valorDer.tipo=="string" ){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */  && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && valorDer.valor=="0" && valorDer.tipo!="number"/*el valor derecho es null */){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if( valorIzq.valor=="0" && valorIzq.tipo!="number"/*el valor izquierdo es null */ && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type") ){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if(tablaDeSimbolos.existe(valorIzq.tipo, undefined, "type") && tablaDeSimbolos.existe(valorDer.tipo, undefined, "type")){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else if(valorIzq.tipo.split("[]").length>1 && valorDer.tipo.split("[]").length>1){
                /*let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valorIzq.valor+"!="+valorDer.valor+";\n";
                return {valor:temporal,tipo:"boolean"};*/
                return {valor:valorIzq.valor+"!="+valorDer.valor,tipo:"boolean"};
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de igualdad con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            let segundaCondicion = nuevaEtiqueta();
            let tempVerdadero, tempFalso;
            if(verdadero==undefined && falso == undefined){
                tempVerdadero= nuevaEtiqueta();
                tempFalso = nuevaEtiqueta();
            }else{
                tempVerdadero= verdadero;
                tempFalso=falso;
            }
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito, undefined, segundaCondicion, tempFalso);
            let tempStr = consola.value;
            consola.value="";
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito, undefined, tempVerdadero, tempFalso);
            let RigthDec = consola.value;
            consola.value=tempStr;
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                if(verdadero==undefined && falso == undefined){
                    let temporal = nuevoTemporal(), final = nuevaEtiqueta();
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorIzq.valor+") goto "+segundaCondicion+";\n";
                        consola.value+="goto "+tempFalso+";\n";
                    }
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+tempFalso+";\n";
                    }
                    consola.value+=tempVerdadero+":\n"
                    consola.value+=temporal+"=1;\n";
                    consola.value+="goto "+final+";\n";
                    consola.value+=tempFalso+":\n"
                    consola.value+=temporal+"=0;\n";
                    consola.value+=final+":\n"
                    return {valor:temporal,tipo:"boolean"};
                }else{
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                    consola.value+="if("+valorIzq.valor+") goto "+segundaCondicion+";\n";
                    consola.value+="goto "+falso+";\n";
                    }
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor+") goto "+verdadero+";\n";
                        consola.value+="goto "+falso+";\n";
                    }
                    return {verdadero:verdadero, falso:falso,tipo:"boolean"};
                }
                
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de AND con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
                let segundaCondicion = nuevaEtiqueta();
                let tempVerdadero, tempFalso;
                if(verdadero==undefined && falso == undefined){
                    tempVerdadero= nuevaEtiqueta();
                    tempFalso = nuevaEtiqueta();
                }else{
                    tempVerdadero= verdadero;
                    tempFalso=falso;
                }
                const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito, undefined, tempVerdadero, segundaCondicion);
                let tempStr = consola.value;
                consola.value="";
                const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito, undefined, tempVerdadero, tempFalso);
                let RigthDec = consola.value;
                consola.value=tempStr;
            if(valorIzq.tipo=="boolean" && valorDer.tipo=="boolean"){
                if(verdadero==undefined && falso == undefined){
                    let temporal = nuevoTemporal(), final = nuevaEtiqueta();
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorIzq.valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+segundaCondicion+";\n"
                    } 
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+tempFalso+";\n";
                    }
                    consola.value+=tempVerdadero+":\n";
                    consola.value+=temporal+"=1;\n";
                    consola.value+="goto "+final+";\n";
                    consola.value+=tempFalso+":\n";
                    consola.value+=temporal+"=0;\n";
                    consola.value+=final+":\n";
                    return {valor:temporal,tipo:"boolean"};
                }else{
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.OR&&expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorIzq.valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+segundaCondicion+";\n";
                    }
                    consola.value+=segundaCondicion+":\n";
                    consola.value+=RigthDec;
                    if(expresion.operandoDer.tipo!=TIPO_OPERACION.OR&&expresion.operandoDer.tipo!=TIPO_OPERACION.AND&&expresion.operandoDer.tipo!=TIPO_OPERACION.NOT){
                        consola.value+="if("+valorDer.valor+") goto "+tempVerdadero+";\n";
                        consola.value+="goto "+falso+";\n";
                    }
                    return {verdadero:verdadero, falso:falso,tipo:"boolean"};
                }                
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de OR con los tipos:'+valorIzq.tipo+','+valorDer.tipo; 
            }
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            let tempVerdadero, tempFalso;
            if(verdadero==undefined && falso == undefined){
                tempVerdadero= nuevaEtiqueta();
                tempFalso = nuevaEtiqueta();
            }else{
                tempVerdadero= verdadero;
                tempFalso=falso;
            }
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito, undefined, tempFalso, tempVerdadero);
            if(valorIzq.tipo=="boolean"){
                if(verdadero==undefined && falso == undefined){
                    let pos_temp=nuevoTemporal(), final = nuevaEtiqueta();
                    if(expresion.operandoIzq.tipo!=TIPO_OPERACION.AND&&expresion.operandoIzq.tipo!=TIPO_OPERACION.NOT&&expresion.operandoIzq.tipo!=TIPO_OPERACION.OR){
                        consola.value+="if("+valorIzq.valor+") goto "+tempFalso+";\n";
                        consola.value+="goto "+tempVerdadero+";\n";
                    }
                    consola.value+=tempVerdadero+":\n";
                    consola.value+=pos_temp+"=1;\n";
                    consola.value+="goto "+final+";\n";
                    consola.value+=tempFalso+":\n";
                    consola.value+=pos_temp+"=0;\n";
                    consola.value+=final+":\n";
                    return {valor:pos_temp,tipo:"boolean"};
                }else{
                    return {verdadero:verdadero, falso:falso,tipo:"boolean"};            
                }
            }else{
                printedTable.erEj.push({descripcion:' No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                throw '>ERROR: No se puede realizar la operación de NOT con el tipos:'+valorIzq.tipo; 
            }
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return {valor:expresion.valor, tipo:"number"};
        } else if (expresion.tipo === TIPO_VALOR.DECIMAL) {
            return {valor:expresion.valor, tipo:"number"};
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return {valor:"1", tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return {valor:"0", tipo:"boolean"};
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            const valIzq=procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
            /*if(valIzq.tipo=="number"||valIzq.tipo=="boolean"){
                let temporal = nuevoTemporal();
                consola.value+=temporal+"="+valIzq.valor+";\n";
                valIzq.valor=temporal;
            }*/
            return  valIzq;
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: "0", tipo: userType , tamanio:1};
        } else if (expresion.data_type === TIPO_DATO.ARRAY) {
            return procesarArray(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo.split("[]").length>1){
            return procesarArray(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo === TIPO_DATO.OBJETO) {
            return procesarObjeto(expresion, tablaDeSimbolos, ambito, userType);
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            let principalValue = {valor:initial, tipo: "string", direcciones:initial};
            strMethods(principalValue, expresion.next_acc, tablaDeSimbolos, ambito);
            return {valor:principalValue.valor, tipo: principalValue.tipo, direcciones:principalValue.valor};
        } else if (expresion.tipo === TIPO_VALOR.CADENA_CHARS) {
            let initial = nuevoTemporal();
            let direcciones = pilas.heap;
            consola.value+=initial+"=h;\n";
            let cadenaUpdated =  sustituirEscapes(expresion);
            for(let i =0;i<cadenaUpdated.length;i++){
                consola.value+="heap[(int)h]="+ cadenaUpdated.charCodeAt(i)+";\nh=h+1;\n";
                heapPush();
            }
            consola.value+="heap[(int)h]=-1;\nh=h+1;\n";
            let principalValue = {valor:initial, tipo: "string", direcciones:initial};
            strMethods(principalValue, expresion.next_acc, tablaDeSimbolos, ambito);
            return {valor:principalValue.valor, tipo: principalValue.tipo, direcciones:principalValue.valor};
        } else if(expresion.tipo===TIPO_DATO.OPERADOR_TERNARIO){
            let verdadero=nuevaEtiqueta(), falso=nuevaEtiqueta(), logica =  procesarExpresionNumerica(expresion.logica, tablaDeSimbolos, ambito, undefined, verdadero, falso);
            if(logica.tipo=="boolean"){
                let temporal = nuevoTemporal(), final=nuevaEtiqueta();
                if(expresion.tipo!=TIPO_OPERACION.AND||expresion.tipo!=TIPO_OPERACION.OR||expresion.tipo!=TIPO_OPERACION.NOT){
                    consola.value+="if("+logica.valor+") goto "+verdadero+";\n";
                    consola.value+="goto "+falso+";\n";
                }                
                consola.value+=verdadero+":\n";
                let valorVerdadero=procesarExpresionNumerica(expresion.result1, tablaDeSimbolos, ambito);
                consola.value+=temporal+"="+valorVerdadero.valor+";\n";
                consola.value+="goto "+final+";\n";
                consola.value+=falso+":\n";
                let valorFalso =procesarExpresionNumerica(expresion.result2, tablaDeSimbolos, ambito);
                consola.value+=temporal+"="+valorFalso.valor+";\n";
                consola.value+=final+":\n";
                if(valorVerdadero.tipo.toLowerCase() != valorFalso.tipo.toLowerCase()){
                    printedTable.erEj.push({descripcion:'Ambos resultados del ternario deben ser del mismo tipo:'+valorVerdadero.tipo+','+valorFalso.tipo,tipo:"semántico", linea:expresion.fila, columna:expresion.columna,ambito:ambito});
                    throw '>ERROR:Ambos resultados del ternario deben ser del mismo tipo:'+valorVerdadero.tipo+','+valorFalso.tipo; 
                }
                return {valor:temporal, tipo:valorVerdadero.tipo};
            }
        } else if (expresion.tipo===TIPO_DATO.NEW_ARRAY){
            let valor = procesarNewArray(expresion.expresion, tablaDeSimbolos, ambito, userType);
            return valor;
        } else {
            printedTable.erEj.push({descripcion:'expresión no válida: ' + expresion.valor[0].valor,ambito:ambito,tipo:"semántico", linea:"temp", columna:"temp"});
            throw 'ERROR: expresión no válida: ' + expresion.valor;
        }
    }
    function procesarArray(arreglo, tablaDeSimbolos, ambito, userType){
        consola.value+="//comienza arreglo \n";
        let temporal = [], tipo="";
        let temp = arreglo.dimension;
        let tamanio=0, direcciones=[],temporales=[],arrayHead=contadores.temporales+1;
        temporales.push(nuevoTemporal());
        consola.value+=temporales[tamanio]+"=h;\n";
        consola.value+="h=h+1;\n"
        tamanio++;
        while(temp!="Epsilon"){
            temporales.push(nuevoTemporal());
            consola.value+=temporales[tamanio]+"=h;\n";
            consola.value+="h=h+1;\n";
            tamanio++;
            temp=temp.next_data;
        }
        consola.value+="heap[(int)"+temporales[0]+"]="+(tamanio-1)+";\n";
        tamanio=1;
        temp = arreglo.dimension;
        while(temp!="Epsilon"){
            let valor = procesarExpresionNumerica(temp.dato, tablaDeSimbolos, ambito, userType);
            consola.value+="heap[(int)"+temporales[tamanio]+"]="+valor.valor+";\n";
            temporal.push(valor);
            tamanio++;
            temp=temp.next_data;
        }
        checkForMultyType(JSON.parse(JSON.stringify(temporal)), tablaDeSimbolos, ambito);
        return {tipo:getType(temporal)+calcularDimensiones(temporal), valor:"t"+arrayHead, direcciones:temporales[0]};
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
        userType=userType.split("[]")[0];
        if(!tablaDeSimbolos.existe(userType, undefined, "type")){
            printedTable.erEj.push({descripcion:'No existe el type:'+userType+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
            throw '>ERROR: No existe el type:'+userType+'.\n';                       
        }  
        let attb =[], tamanio=0;
        let temp = instruccion.atributos;
        while(temp!="Epsilon"){
            attb.push(nuevoTemporal());
            consola.value+=attb[tamanio]+"=h;\n";
            consola.value+="h=h+1;\n";
            tamanio++;
            temp=temp.next;
        }
        let tipo = tablaDeSimbolos.obtenerType(userType);
        if(tipo.atributos.length!=attb.length){
            printedTable.erEj.push({descripcion:'Se deben inicializar todos los atributos del type.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
            throw '>ERROR: Se deben inicializar todos los atributos del type.\n'; 
        }
        temp = instruccion.atributos;
        let count =0;
        let direcciones = [];
        while(temp!="Epsilon"){
            //consola.value+=nuevoTemporal()+"="+"h;\nh=h+1;\n";
            /*let temporalHeap = pilas.heap, temporalInit=contadores.temporales+1, dir;
            let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito, userType);
            if(valor.tipo=="number"||valor.tipo=="boolean"){
                dir = nuevoTemporal();
                consola.value+=dir+"=h;\n";
                consola.value+="heap[(int)"+dir+"]="+valor.valor+";\nh=h+1;\n";
                heapPush();
                valor.direcciones=dir;
            }*/

            let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito, tipo.atributos[count].tipo);
            consola.value+="heap[(int)"+attb[count]+"]="+valor.valor+";\n";
            //temporal.push(valor);
            //heapPush();
            if(tablaDeSimbolos.existe(tipo.atributos[count].tipo.split("[]")[0], undefined, "type")&&valor.valor=="0"){
                if(valor.tipo!=tipo.atributos[count].tipo){
                    printedTable.erEj.push({descripcion:'No coincide el tipo del atributo '+tipo.atributos[count].id+'.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR: No coincide el tipo del atributo '+tipo.atributos[count].id+'.\n'; 
                }
            }
            //direcciones[count]={id:attb[count].id,direcciones:valor.direcciones};
            //consola.value+="heap[(int)t"+temporalInit+"]="+valor.valor+";\n";
            temp=temp.next;
            //temporalInit++;
            count++;
            /**/
        }      
        consola.value+="//termina declaracion de objeto de tipo "+userType+" \n";
        return { tipo:userType, direcciones:attb[0], valor:attb[0]};
    }
    function ExistingAttribute(typeID, attributeID, tablaDeSimbolos){
        let type = tablaDeSimbolos.obtenerType(typeID);
        let contador = 0;
        for(let attribute of type.atributos){
            if(LowerCase(attribute.id)==LowerCase(attributeID)){
                return {valor:attribute, posicion:contador};
            }
            contador++;
        }
        return false;
    }
    function procesarAccID(instruccion, tablaDeSimbolos, ambito){
        let principalValue = tablaDeSimbolos.obtenerSimbolo(instruccion.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        //determinar si se busca en el stack o en el heap
        let pila = "";
        if(/*ambito=="Global" ||*/principalValue.ambito=="Global"){
            pila="heap";
        }else{
            pila="stack";
        }        
        let temp = instruccion.acc;
        //se lo cambio a esta parte porque si es un number o boolean no tiene por qué tener acceso a una posición o atributo o método
        if(principalValue.tipo =="number" || principalValue.tipo=="boolean"){
            let temporal = nuevoTemporal();
            consola.value+=temporal+"="+pila+"[(int)"+principalValue.valor+"];\n";
            principalValue.valor=temporal;
        }else if(pila=="stack"){
            let temporal = nuevoTemporal();
            consola.value+=temporal+"=stack[(int)"+principalValue.valor+"];\n";//dirección en el heap
            principalValue.valor=temporal;
        }
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    printedTable.erEj.push({descripcion:'No existe el atributo '+temp.atributo,tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                //para cuando sean atributos nulos
                if(principalValue.valor==null && tablaDeSimbolos.existe(principalValue.tipo, undefined, "type")){
                    break;
                }
              //  consola.value+=finalDirection+"="+finalDirection+"+"+value.posicion+";\n";
             //   if(value.valor.tipo=="number"||value.valor.tipo=="boolean"){
                    let temporal1=nuevoTemporal(),temporal2=nuevoTemporal(); 
                    consola.value+=temporal1+"="+principalValue.valor+"+"+(value.posicion)+";\n";
                    consola.value+=temporal2+"=heap[(int)"+temporal1+"];\n";
                    principalValue.valor=temporal2;
                    principalValue.tipo=value.valor.tipo;
                    //no sé por qué había separado los tipos tengo que ver 
              /*  }else{
                    let temporal1=nuevoTemporal();
                    consola.value+=temporal1+"="+principalValue.valor+"+"+value.posicion+";\n";
                    principalValue.valor=temporal1;
                    principalValue.tipo=value.valor.tipo;
                }*/
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(principalValue.tipo.split("[]")==1){
                    printedTable.erEj.push({descripcion:'Intento de acceso a posición de array inexistente',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    printedTable.erEj.push({descripcion:'No se reconoce la expresion '+valor.valor+' como un index.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                //no sabemos el valor de la posición del array 
                let tipo ="";
                for(let e =0;e<principalValue.tipo.split("[]").length-1;e++){
                    if(e==0)tipo+=principalValue.tipo.split("[]")[e];
                    else tipo+="[]";
                }
                principalValue.tipo=tipo;
              //  if(principalValue.tipo=="number" || principalValue.tipo=="boolean" || principalValue.tipo.split("[]").length>1){
                    let temporal1=nuevoTemporal(),temporal2=nuevoTemporal(),temporal3=nuevoTemporal();
                    consola.value+=temporal1+"="+valor.valor+"+1;\n";
                    consola.value+=temporal2+"="+principalValue.valor+"+"+temporal1+";\n";
                    consola.value+=temporal3+"=heap[(int)"+temporal2+"];\n";
                    principalValue.valor=temporal3;
             /*   }else{
                    let suma = nuevoTemporal();
                    consola.vlaue+=suma+"="+valor.valor+"+1;\n";
                    principalValue.valor=principalValue.valor+"["+suma+"]";
                }*/
            }else if(temp.sentencia==SENTENCIAS.LENGTH){//R
                if(principalValue.tipo.split("[]").length>1 || principalValue.tipo =="string"){
                    if(principalValue.tipo =="string"){
                        consola.value+="t4="+principalValue.valor+";\n";
                        let temporal = nuevoTemporal(), posicion = nuevoTemporal();
                        consola.value+="strLength();\n"
                        consola.value+=temporal+"= t4-"+principalValue.valor+";\n";
                        //consola.value+=posicion+"=h;\n"+pila+"[(int)"+posicion+"]="+temporal+";\n";
                        principalValue.valor= temporal;
                        principalValue.tipo="number";
                    }else{
                        let temporal = nuevoTemporal();
                        consola.value+="//en la posición 0 está el size\n";
                        consola.value+=temporal+"=heap[(int)"+principalValue.valor+"];\n";
                        principalValue.valor=temporal;
                        principalValue.tipo="number";
                    }            
                }else{
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Length a un array inexistente.\n';  
                    printedTable.erEj.push({descripcion:'Intento de Length a un array inexistente.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: Intento de Length a un array inexistente.\n';     
                }                
                //principalValue={valor:principalValue.valor.length, tipo:"number"};
                break;
            }else if(temp.sentencia==SENTENCIAS.CHAR_AT){
                if(principalValue.tipo!="string"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede obtener un CharAt en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';  
                    printedTable.erEj.push({descripcion:''+valor.tipo+' no se puede usar como un índice en CharAt',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';                    
                }
                let temporal1= nuevoTemporal(),temporal2 = nuevoTemporal(), temporal3=nuevoTemporal();
                consola.value+=temporal1+"="+principalValue.valor+"+"+valor.valor+";\n";
                consola.value+=temporal3+"=heap[(int)"+temporal1+"];\n";
                consola.value+=temporal2+"=h;\nheap[(int)"+temporal2+"]="+temporal3+";\nh=h+1;\nheap[(int)h]=-1;\nh=h+1;\n"
                principalValue.valor=temporal2;
            }else if(temp.sentencia==SENTENCIAS.TO_LOWER_CASE){
                if(principalValue.tipo!="string"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toLowerCase en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';                    
                }
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\nt0="+principalValue.valor+";\n";
                consola.value+="toLowerCase();\n";
                principalValue.valor=temporal;
            }else if(temp.sentencia==SENTENCIAS.TO_UPPER_CASE){
                if(principalValue.tipo!="string"){
                   // consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\nt0="+principalValue.valor+";\n";
                consola.value+="toUpperCase();\n";
                principalValue.valor=temporal;
            }else if(temp.sentencia==SENTENCIAS.CONCAT){
                if(principalValue.tipo!="string"){
                   // consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="string"){
                   // consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede concatenar '+valor.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede concatenar '+valor.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede concatenar '+valor.tipo+'.\n';                    
                }
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+principalValue.valor+";\n";
                consola.value+="t3="+valor.valor+";\n";
                consola.value+="concatenar();\n";   
                principalValue.valor=temporal;
            }
            temp=temp.next_acc;
        }
        return {valor: principalValue.valor, tipo:principalValue.tipo, reference:true};   
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
                //consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                throw 'ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            } else if (funcion.parametros.length == 0 && instruccion.parametros != "Epsilon") {
                //consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            }else{
                let argumentos = [];
                let temp = instruccion.parametros;
                while(temp!="Epsilon"){
                    argumentos.push(procesarExpresionNumerica(temp.expresion, tablaDeSimbolos, ambito));
                    temp=temp.siguiente;
                }
                const tsFuncion = new TS(tsGlobal.simbolos.slice(), printedTable);
                const tsTemp = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                consola.value+="//insertar parámetrso en el stack\n";
                let apuntador = nuevoTemporal();
                consola.value+=apuntador+"=p;\n";
                for(let i = 0; i < funcion.parametros.length;i++){
                    if(funcion.parametros[i].tipo==argumentos[i].tipo){
                        //se acepta el argumento para ser usado por los parámetros
                       // tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                       // tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                       let temporal = nuevoTemporal();
                       consola.value+=temporal+"="+apuntador+"+"+(i+1)+";\n";
                       consola.value+="stack[(int)"+temporal+"]="+argumentos[i].valor+";\n";
                    }else if(tablaDeSimbolos.existe(funcion.parametros[i].tipo, undefined, "type") && argumentos[i].valor=="0"){
                        //para que acepte los nulls    
                        tsTemp.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else{
                        consola.value+='ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                        printedTable.erEj.push({descripcion:'La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.',tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                        throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                    }
                }      
                    consola.value+=instruccion.id+"();\n";
                    if(funcion.tipo!="void"){
                        let temporal=nuevoTemporal();
                        consola.value+=temporal+"=stack[(int)p];\np="+apuntador+"+1;\n";
                        return {valor:temporal, tipo:funcion.tipo};
                    }else{
                        consola.value+="p="+apuntador+";\n";
                    }
                //declarar parámetros con los valores de los argumentos
            }
        }else{
            printedTable.erEj.push({descripcion:'No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito,tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
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
        let principalValue = tablaDeSimbolos.obtenerSimbolo(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        //determinar si se busca en el stack o en el heap
        let pila = "";
        if(ambito=="Global" ||principalValue.ambito=="Global"){
            pila="heap";
        }else{
            pila="stack";
        }        
        let temp = instruccion.id.acc;
        //se lo cambio a esta parte porque si es un number o boolean no tiene por qué tener acceso a una posición o atributo o método
        if(principalValue.tipo =="number" || principalValue.tipo=="boolean"){
            /*let temporal = nuevoTemporal();
            consola.value+=temporal+"="+pila+"[(int)"+principalValue.valor+"];\n";
            principalValue.valor=temporal;*/
        }else if(pila=="stack"){
            let temporal = nuevoTemporal();
            consola.value+=temporal+"=stack[(int)"+principalValue.valor+"];\n";//dirección en el heap
            //consola.value+=temporal2+"=heap[(int)"+temporal+"];\n";
            //principalValue.valor=temporal2;
            principalValue.valor=temporal;
        }
        while(temp!="Epsilon"){
            pila="heap";
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                   printedTable.erEj.push({descripcion:'No existe el atributo '+temp.atributo,tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                let temporal1=nuevoTemporal(); 
                consola.value+=temporal1+"="+principalValue.valor+"+"+(value.posicion)+";\n";
                //consola.value+=temporal2+"= heap[(int)"+temporal1+"];\n";
                //principalValue.valor=temporal2;
                principalValue.valor=temporal1;
                principalValue.tipo=value.valor.tipo;
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){
                if(principalValue.tipo.split("[]")==1){
                    printedTable.erEj.push({descripcion:'Intento de acceso a posición de array inexistente',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    printedTable.erEj.push({descripcion:'No se reconoce la expresion '+valor.valor+' como un index.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                let tipo ="";
                for(let e =0;e<principalValue.tipo.split("[]").length-1;e++){
                    if(e==0)tipo+=principalValue.tipo.split("[]")[e];
                    else tipo+="[]";
                }
                principalValue.tipo=tipo;
                let temporal1=nuevoTemporal(),temporal2=nuevoTemporal();
                consola.value+=temporal1+"="+valor.valor+"+1;\n";
                consola.value+=temporal2+"="+principalValue.valor+"+"+temporal1+";\n";
                //consola.value+=temporal3+"= heap[(int)"+temporal2+"];\n";
                principalValue.valor=temporal2;
            }
            temp=temp.next_acc;
        }
        if(principalValue.tipo=="number" || principalValue.tipo=="string"){
            if(instruccion.sentencia==SENTENCIAS.INCREMENTO){
                let temporal = nuevoTemporal(), temporal2=nuevoTemporal();
                consola.value+=temporal+"="+pila+"[(int)"+principalValue.valor+"];\n";
                consola.value+=temporal2+"="+temporal+"+"+1+";\n";
                consola.value+=pila+"[(int)"+principalValue.valor+"]="+temporal2+";\n";
            }else if(instruccion.sentencia==SENTENCIAS.DECREMENTO){
                let temporal = nuevoTemporal(), temporal2=nuevoTemporal();
                consola.value+=temporal+"="+pila+"[(int)"+principalValue.valor+"];\n";
                consola.value+=temporal2+"="+temporal+"-"+1+";\n";
                consola.value+=pila+"[(int)"+principalValue.valor+"]="+temporal2+";\n";
            }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_SUMA){
                let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                if(valor.tipo == "number" ||valor.tipo == "boolean"){
                    //principalValue.valor+=valor.valor;
                    let temporal = nuevoTemporal(), temporal2=nuevoTemporal();
                    consola.value+=temporal+"="+pila+"[(int)"+principalValue.valor+"];\n";
                    consola.value+=temporal2+"="+temporal+"+"+valor.valor+";\n";
                    consola.value+=pila+"[(int)"+principalValue.valor+"]="+temporal2+";\n";
                }else if(valor.tipo == "string" ){
                    if(valor.tipo=="string"){
                        let temporal = nuevoTemporal();
                        consola.value+=temporal+"=h;\n";
                        consola.value+="t1=heap[(int)"+principalValue.valor+"];\n";
                        consola.value+="t3="+valor.valor+";\n";
                        consola.value+="concatenar();\n";
                        consola.value+=principalValue.valor+"="+temporal+";\n";
                    }else  if(valor.tipo=="number"){
                        let temporal = nuevoTemporal();
                        consola.value+=temporal+"=h;\n";
                        consola.value+="t1=heap[(int)"+principalValue.valor+"];\n";
                        consola.value+="t3="+valor.valor+";\n";
                        consola.value+="conStrNum();\n";
                        consola.value+="heap[(int)"+principalValue.valor+"]="+temporal+";\n";
                    }else{//boolean
                        let temporal = nuevoTemporal();
                        consola.value+=temporal+"=h;\n";
                        consola.value+="t1=heap[(int)"+principalValue.valor+"];\n";
                        consola.value+="t3="+valor.valor+";\n";
                        consola.value+="conStrBool();\n";
                        consola.value+="heap[(int)"+principalValue.valor+"]="+temporal+";\n";
                    }
                }else{
                    //consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                    printedTable.erEj.push({descripcion:'No se puede hacer una adicción del tipo ' + valor.tipo,tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna, ambito:ambito}); 
                    throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
                }
            }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_RESTA){
                let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                if(valor.tipo == "number" ||valor.tipo == "boolean"){
                    let temporal = nuevoTemporal(), temporal2=nuevoTemporal();
                    consola.value+=temporal+"="+pila+"[(int)"+principalValue.valor+"];\n";
                    consola.value+=temporal2+"="+temporal+"-"+valor.valor+";\n";
                    consola.value+=pila+"[(int)"+principalValue.valor+"]="+temporal2+";\n";
                }else{
                //  consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                    printedTable.erEj.push({descripcion:'No se puede hacer una adicción del tipo ' + valor.tipo,tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna, ambito:ambito}); 
                    throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
                }        
            }
        }else{
            //consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede usar el operador += con el tipo de dato: ' + principalValue.tipo+'\n';  
            printedTable.erEj.push({descripcion:'No se puede usar el operador += con el tipo de dato: ' + principalValue.tipo,tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna, ambito:ambito}); 
            throw '>ERROR: Incompatibilidad de tipos: No se puede usar el operador += con el tipo de dato: ' + principalValue.tipo+'\n'; 
        }
        
    }
    //SENTENCIAS DE CONTROL 
    function procesarIf(instruccion, tablaDeSimbolos, ambito, inicio, falsoC, retorno) {
        consola.value+="//comienza el if\n";
        let verdadero = nuevaEtiqueta(), falso = nuevaEtiqueta(), final=nuevaEtiqueta();
        const logica = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito, undefined, verdadero, falso);
        if(instruccion.logica.tipo!=TIPO_OPERACION.AND && instruccion.logica.tipo!=TIPO_OPERACION.OR&&instruccion.logica.tipo!=TIPO_OPERACION.NOT){
            consola.value+="if("+logica.valor+") goto "+verdadero+";\ngoto "+falso+";\n";
        }        
        consola.value+=verdadero+":\n";
        const tsIf = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
        procesarBloque(instruccion.accion, tsIf, ambito, inicio, falsoC, retorno);    
        consola.value+="goto "+final+";\n";
        consola.value+=falso+":\n";
        if (instruccion.else != "Epsilon") {
                if (instruccion.else.sentencia === SENTENCIAS.ELSE_IF) {
                    const tsElIf = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                    procesarIf(instruccion.else, tsElIf, ambito, inicio, falsoC);
                } else {
                    const tsElse = new TS(tablaDeSimbolos.simbolos.slice(), printedTable);
                    procesarBloque(instruccion.else.accion, tsElse, ambito, inicio, falsoC, retorno);
                }
        }
        consola.value+=final+":\n";    
    }
    function procesarFor(instruccion, tablaDeSimbolos, ambito, retorno) {
        let inicio =nuevaEtiqueta(), actualizar=nuevaEtiqueta(), verdadero= nuevaEtiqueta(), falso = nuevaEtiqueta(), temporalID =  nuevoTemporal();
        procesarBloque([instruccion.inicial], tablaDeSimbolos, ambito);
        let instruccionID = instruccion.inicial.sentencia==SENTENCIAS.ASIGNACION?instruccion.inicial.id.id:instruccion.inicial.id;
        //asignarle el valor del ID al temporal de control
        const valor = procesarExpresionNumerica(instruccion.inicial.expresion, tablaDeSimbolos, ambito, undefined, verdadero, falso);
        tablaDeSimbolos.actualizar(instruccionID, valor);//, SplitAmbitos(ambito)
        if (instruccion.paso.paso == "++") {
            consola.value+=inicio+":\n";
            let condicion = procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito, undefined, verdadero, falso);
            if(instruccion.final.tipo!=TIPO_OPERACION.AND&&instruccion.final.tipo!=TIPO_OPERACION.OR&&instruccion.final.tipo!=TIPO_OPERACION.NOT){
                consola.value+="if("+condicion.valor+") goto "+verdadero+";\ngoto "+falso+";\n";
            }
            consola.value+=actualizar+":\n";
            let identificador = tablaDeSimbolos.getSimbol(instruccionID,SplitAmbitos(ambito), "inFor", "inFor");
            let pila=(identificador.ambito=="Global")?"heap":"stack";
            consola.value+=temporalID+"="+pila+"[(int)"+identificador.direcciones+"]+1;\n"+pila+"[(int)"+identificador.direcciones+"]="+temporalID+";\n";
            consola.value+="goto "+inicio+";\n";
            consola.value+=verdadero+":\n";
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
            procesarBloque(instruccion.accion, tsFor, ambito, actualizar, falso, retorno);
            //incremento
            consola.value+="goto "+actualizar+";\n"; 
            consola.value+=falso+":\n";
        } else if (instruccion.paso.paso == "--") {
            consola.value+=inicio+":\n";
            let condicion = procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito, undefined, verdadero, falso);
            consola.value+="if("+condicion.valor+") goto "+verdadero+";\ngoto "+falso+";\n";
            consola.value+=actualizar+":\n";
            let identificador = tablaDeSimbolos.getSimbol(instruccionID,SplitAmbitos(ambito), "inFor", "inFor");
            let pila=(identificador.ambito=="Global")?"heap":"stack";
            consola.value+=temporalID+"="+pila+"[(int)"+identificador.direcciones+"]-1;\n"+pila+"[(int)"+identificador.direcciones+"]="+temporalID+";\n";
            consola.value+="goto "+inicio+";\n";
            consola.value+=verdadero+":\n";
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
            procesarBloque(instruccion.accion, tsFor, ambito, actualizar, falso, retorno);
            //incremento
            consola.value+="goto "+actualizar+";\n"; 
            consola.value+=falso+":\n";
        } else {
            consola.value+=inicio+":\n";
            let condicion = procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito, undefined, verdadero, falso);
            consola.value+="if("+condicion.valor+") goto "+verdadero+";\ngoto "+falso+";\n";
            consola.value+=actualizar+":\n";
            let identificador = tablaDeSimbolos.getSimbol(instruccionID,SplitAmbitos(ambito), "inFor", "inFor");
            let pila=(identificador.ambito=="Global")?"heap":"stack";
            let valor = procesarExpresionNumerica(instruccion.paso.paso, tablaDeSimbolos, ambito);
            consola.value+=temporalID+"="+valor.valor+";\n"+pila+"[(int)"+identificador.direcciones+"]="+temporalID+";\n";
            consola.value+="goto "+inicio+";\n";
            consola.value+=verdadero+":\n";
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
            procesarBloque(instruccion.accion, tsFor, ambito, actualizar, falso, retorno);
            //incremento
            consola.value+="goto "+actualizar+";\n"; 
            consola.value+=falso+":\n";    
        }
    
    }
    function procesarForOF(instruccion, tablaDeSimbolos, ambito, retorno){
        let conjunto = procesarExpresionNumerica(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(conjunto.tipo.split("[]").length==1){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        let temporal1 = nuevoTemporal(), size=nuevoTemporal(), temporal2=nuevoTemporal(), temporal3= nuevoTemporal(),inicio = nuevaEtiqueta(), actualizacion =  nuevaEtiqueta(), ejecucion = nuevaEtiqueta(), final = nuevaEtiqueta();
        consola.value+="//comienza For Of\n";
        consola.value+=temporal1+"=-1;\n";
        consola.value+=size+"=heap[(int)"+conjunto.valor+"];\n";
        consola.value+="goto "+actualizacion+";\n";
        consola.value+=inicio+":\n";        
        consola.value+="if("+temporal1+"<"+size+") goto "+ejecucion+";\n";
        consola.value+="goto "+final+";\n";
        consola.value+=actualizacion+":\n";
        consola.value+=temporal1+"="+temporal1+"+1;\n";
        consola.value+=temporal2+"="+conjunto.valor+"+1;\n";
        consola.value+=temporal3+"="+temporal1+"+"+temporal2+";\n";  
        let tipo ="";
       /* for(let i = 0; i<conjunto.tipo.split("[]").length-1;i++){
            if(i==0)tipo+=conjunto.tipo.split("[]")[i];
            else tipo+="[]";
        }   */ 
        tipo=procesarDataType(instruccion.tipo);  
        if(tipo.split("[]").length>1){
            let temporal4 = nuevoTemporal();
            consola.value+=temporal4+"=heap[(int)"+temporal3+"];\n";
            tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, tipo, "Global", "temp", "temp", temporal4);
        }else{
            if(tipo.toLowerCase()=="number" || tipo.toLowerCase()=="boolean"){
                tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, tipo, "Global", "temp", "temp", temporal3);
            }else{
                let temporal4 = nuevoTemporal();
                consola.value+=temporal4+"=heap[(int)"+temporal3+"];\n";
                tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, tipo, "Global", "temp", "temp", temporal4);
            }
        }
        consola.value+="goto "+inicio+";\n";
        //se pasa el ámbito como global para que si son number/bollean los busque en el hea
        consola.value+=ejecucion+":\n";
        const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
        procesarBloque(instruccion.accion, tsFor, ambito, actualizacion, final, retorno);
        consola.value+="goto "+actualizacion+";\n";
        consola.value+=final+":\n";
    }
    function procesarForIn(instruccion, tablaDeSimbolos, ambito, retorno){
        let conjunto = procesarExpresionNumerica(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(conjunto.tipo.split("[]").length==1){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        let temporal2=nuevoTemporal(),temporal3=nuevoTemporal(),temporal4=nuevoTemporal(), size=nuevoTemporal(),inicio = nuevaEtiqueta(), actualizacion =  nuevaEtiqueta(), ejecucion = nuevaEtiqueta(), final = nuevaEtiqueta();
        consola.value+="//comienza For In\n";
        consola.value+=temporal2+"=h;\n";
        consola.value+="heap[(int)"+temporal2+"]=-1;\nh=h+1;";
        consola.value+=size+"=heap[(int)"+conjunto.valor+"];\n";
        consola.value+="goto "+actualizacion+";\n";
        consola.value+=inicio+":\n";
        consola.value+=temporal4+"=heap[(int)"+temporal2+"];\n";        
        consola.value+="if("+temporal4+"<"+size+") goto "+ejecucion+";\n";
        consola.value+="goto "+final+";\n";
        consola.value+=actualizacion+":\n";
        consola.value+=temporal3+"=heap[(int)"+temporal2+"];\n";
        consola.value+="heap[(int)"+temporal2+"]="+temporal3+"+1;\n";
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "number", "Global", "temp", "temp", temporal2);
        consola.value+="goto "+inicio+";\n";
        //se pasa el ámbito como global para que si son number/bollean los busque en el hea
        consola.value+=ejecucion+":\n";
        const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
        procesarBloque(instruccion.accion, tsFor, ambito, actualizacion, final, retorno);
        consola.value+="goto "+actualizacion+";\n";
        consola.value+=final+":\n";
    }
    function procesarWhile(instruccion ,tablaDeSimbolos, ambito, retorno){
        let inicio = nuevaEtiqueta(), verdadero=nuevaEtiqueta(), falso= nuevaEtiqueta();
        consola.value+=inicio+": \n";
        let valor = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito, verdadero, falso);
        if(instruccion.logica.tipo!=TIPO_OPERACION.AND && instruccion.logica.tipo!=TIPO_OPERACION.OR&&instruccion.logica.tipo!=TIPO_OPERACION.NOT){
            consola.value+="if("+valor.valor+") goto "+verdadero+";\ngoto "+falso+";\n";
        } 
        //consola.value+="if("+valor.valor+") goto "+verdadero+";\n";
        //consola.value+="goto "+falso+";\n";
        consola.value+=verdadero+":\n";
        const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
        procesarBloque(instruccion.accion, tsFor, ambito, inicio, falso, retorno);
        consola.value+="goto "+inicio+";\n";
        consola.value+=falso+":\n";        
    }
    function procesarDoWhile(instruccion ,tablaDeSimbolos, ambito, retorno){
        let inicio = nuevaEtiqueta(), falso = nuevaEtiqueta();
        consola.value+=inicio+":\n";
        const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
        procesarBloque(instruccion.accion, tsFor, ambito, inicio, falso, retorno);
        let valor = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito, undefined, inicio, falso);
        if(instruccion.logica.tipo!=TIPO_OPERACION.AND && instruccion.logica.tipo!=TIPO_OPERACION.OR&&instruccion.logica.tipo!=TIPO_OPERACION.NOT){
            consola.value+="if("+valor.valor+") goto "+inicio+";\ngoto "+falso+";\n";
        } 
        consola.value+=falso+":\n";
        //consola.value+="if("+valor.valor+") goto "+inicio+";\n";
        //consola.value+="goto "+falso+";\n"+falso+":\n";
    }
    function procesarSwitch(instruccion, tablaDeSimbolos, ambito, retorno){
        let original = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        if(original.tipo!="number"&&original.tipo!="boolean"){
            printedTable.erEj.push({descripcion:'No se puede realizar un switch con el tipo '+original.tipo,tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
            throw '>ERROR:No se puede realizar un switch con el tipo '+original.tipo+'.\n'; 
        } 
        let inicio = nuevaEtiqueta(), casos=nuevaEtiqueta(), final = nuevaEtiqueta(), temp = instruccion.cases, comparacion=nuevoTemporal(), etiquetas = [];
        consola.value+="goto "+inicio+";\n";
        while(temp!="Epsilon"){       
            let caso =nuevaEtiqueta();   
            etiquetas.push(caso);         
            consola.value+=caso+":\n";
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), printedTable); 
            procesarBloque(temp.accion, tsFor, ambito, undefined, final, retorno);            
            if(temp.logica=="default"){
                break;
            }
            temp=temp.next_case;
        }
        consola.value+="goto "+final+";\n";
        temp = instruccion.cases;
        consola.value+=inicio+":\n";
        for(let i =0; i < etiquetas.length;i++){
            if(temp.logica!="default"){
            let logica = procesarExpresionNumerica(temp.logica, tablaDeSimbolos, ambito); 
                /*if(original.tipo=="string" && logica.tipo=="string"){
                    consola.value+="t0="+original.valor+";\nt1="+logica.valor+";\n";
                    consola.value+="compareStrs();\n";
                    consola.value+=comparacion+"=t2;\n"
                }else*/
                if(logica.tipo=="number"||logica.tipo=="boolean"){
                    consola.value+=comparacion+"="+original.valor+"=="+logica.valor+";\n"; 
                }else{
                    printedTable.erEj.push({descripcion:'No se puede realizar un switch con los tipos '+original.tipo+", "+logica.tipo,tipo:"semántico", linea:instruccion.fila, columna:instruccion.columna,ambito:ambito});
                    throw '>ERROR:No se puede realizar un switch con los tipos '+original.tipo+", "+logica.tipo+'.\n'; 
                }             
                consola.value+="if("+comparacion+") goto "+etiquetas[i]+";\n";
            }else{
                consola.value+="goto "+etiquetas[i]+";\n";
            }
            temp=temp.next_case;
        } 
        consola.value+=final+":\n";
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
    function nuevoArreglo(dimension){
        switch(dimension){
            case 1:
                arreglos.uno++;
                return "arrayOne"+arreglos.uno;
            case 2:
                arreglos.dos++;
                return "arrayTwo"+arreglos.dos;
            case 3:
                arreglos.tres++;
                return "arrayThree"+arreglos.tres;
            case 4:
                arreglos.cuatro++;
                return "arrayFour"+arreglos.cuatro;
            case 5:
                arreglos.cinco++;
                return "arrayFive"+arreglos.cinco;
        }
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
        for(let i = 0;i<=contadores.temporales;i++){
            txt+="t"+i;
            txt+=(i<contadores.temporales)?",":"";
        }
        for(let i =0;i<arreglos.uno;i++){
            txt+= ",*arrayOne"+(i+1);
        }
        for(let i =0;i<arreglos.dos;i++){
            txt+= ",**arrayTwo"+(i+1);
        }
        for(let i =0;i<arreglos.tres;i++){
            txt+= ",***arrayThree"+(i+1);
        }
        for(let i =0;i<arreglos.cuatro;i++){
            txt+= ",****arrayFour"+(i+1);
        }
        for(let i =0;i<arreglos.cinco;i++){
            txt+= ",*****arrayFive"+(i+1);
        }
        return txt+";\n";
    }
    function funcionesNativas(){
        //funcion para imprimir strings
        let text = "void imprimir(){\nL0: if(heap[(int)t0]!=-1) goto L1;\ngoto L4;\nL1: if(heap[(int)t0]>=299) goto L2;\nif(heap[(int)t0]<-1) goto L3;\nprintf(\"%c\", (char)heap[(int)t0]);\nt0=t0+1;\ngoto L0;\nL2:\nt1= heap[(int)t0];\nt2=t1-300;\nprintf(\"%f\",t2);\nt0=t0+1;\ngoto L0;\nL3:\nt1= heap[(int)t0];\nprintf(\"%f\",t1);\nt0=t0+1;\ngoto L0;\nL4:\nreturn;\n}\n";
        //función para concatenar 2 strings
        text+="//t1 y t3 son el inicio de las cadenas\nvoid concatenar(){\nL0:\nif(heap[(int)t1]!=-1) goto L1;\ngoto L2;\nL1:\nt2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L0;\nL2: if(heap[(int)t3]!=-1) goto L3;\ngoto L4;\n";
        text+="L3:\nt2=heap[(int)t3];\nheap[(int)h]=t2;\nh=h+1;\nt3=t3+1;\ngoto L2;\nL4:\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion para calcular el length de strings
        text+="//t4 es la cadena \nvoid strLength(){\nL0:\nif(heap[(int)t4]!=-1) goto L1;\ngoto L2;\nL1:\nt4=t4+1;\ngoto L0;\nL2:\n return;\n}\n";
        //funcion para concatenar una string y un numero 
        text+="//t1=Cadena,t2,t3=numero\nvoid conStrNum(){\nL0:\nif(heap[(int)t1]!=-1) goto L1;\ngoto L2;\nL1:\nt2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L0;\nL2:\nif(t3<-1) goto L3;\ngoto L4;\nL3:\nheap[(int)h]=t3;\nh=h+1;\ngoto L5;\nL4:\nheap[(int)h]=t3+300;\nh=h+1;\ngoto L5;\nL5:\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion para concatenar un número y string
        text+="//t1=Cadena,t2,t3=numero\nvoid conNumStr(){\nL0:\nif(t3<-1) goto L1;\ngoto L2;\nL1:\nheap[(int)h]=t3;\nh=h+1;\ngoto L3;\nL2:\nheap[(int)h]=t3+300;\nh=h+1;\ngoto L3;\nL3:\n if(heap[(int)t1]!=-1) goto L4;\ngoto L5;\nL4:\nt2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L3;\nL5:\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion toLowerCase
        text+="//t0=inicio de cadena, t1=cambio de letra\nvoid toLowerCase(){\nL0:\nif(heap[(int)t0]!=-1) goto L1;\ngoto L5;\nL1:\nif(heap[(int)t0]>=65) goto L2;\ngoto L3;\nL2:\nif(heap[(int)t0]<=90) goto L4;\nL3: \nt1=heap[(int)t0];\nheap[(int)h]=t1;\nh=h+1;\nt0=t0+1;\ngoto L0;\nL4:\nt1=heap[(int)t0];\nt1=t1+32;\nheap[(int)h]=t1;\nh=h+1;\nt0=t0+1;\ngoto L0;\nL5:\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion toUpperCase
        text+="//t0=inicio de cadena, t1=cambio de letra\nvoid toUpperCase(){\nL0:\nif(heap[(int)t0]!=-1) goto L1;\ngoto L5;\nL1:\nif(heap[(int)t0]>=97) goto L2;\ngoto L3;\nL2:\nif(heap[(int)t0]<=122) goto L4;\nL3: \nt1=heap[(int)t0];\nheap[(int)h]=t1;\nh=h+1;\nt0=t0+1;\ngoto L0;\nL4:\nt1=heap[(int)t0];\nt1=t1-32;\nheap[(int)h]=t1;\nh=h+1;\nt0=t0+1;\ngoto L0;\nL5:\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion para concatenar string y boolean
        text+="//t1=Cadena,t2,t3=boolean;\nvoid conStrBool(){\nL0:\nif(heap[(int)t1]!=-1) goto L1;\ngoto L2;\nL1: \nt2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L0;\nL2: \nif(t3==1) goto L3;\ngoto L4;\nL3:\nheap[(int)h]=116;\nh=h+1;\nheap[(int)h]=114;\nh=h+1;\nheap[(int)h]=117;\nh=h+1;\nheap[(int)h]=101;\nh=h+1;\nheap[(int)h]=-1;\nh=h+1;\ngoto L5;\nL4:\nheap[(int)h]=102;\nh=h+1;\nheap[(int)h]=97;\nh=h+1;\nheap[(int)h]=108;\nh=h+1;\nheap[(int)h]=115;\nh=h+1;\nheap[(int)h]=101;\nh=h+1;\nheap[(int)h]=-1;\nh=h+1;\nL5:\nreturn;\n}\n";
        //funcion para concatenar boolean y string
        text+="//t1=Cadena,t2,t3=boolean;\nvoid conBoolStr(){\nL0:\nif(t3==1) goto L1;\ngoto L2;\nL1:\nheap[(int)h]=116;\nh=h+1;\nheap[(int)h]=114;\nh=h+1;\nheap[(int)h]=117;\nh=h+1;\nheap[(int)h]=101;\nh=h+1;\ngoto L3;\nL2:\nheap[(int)h]=102;\nh=h+1;\nheap[(int)h]=97;\nh=h+1;\nheap[(int)h]=108;\nh=h+1;\nheap[(int)h]=115;\nh=h+1;\nheap[(int)h]=101;\nh=h+1;\nL3:\n if(heap[(int)t1]!=-1) goto L4;\ngoto L5;\nL4: t2=heap[(int)t1];\nheap[(int)h]=t2;\nh=h+1;\nt1=t1+1;\ngoto L3; \nL5:\nheap[(int)h]=-1;\nh=h+1;\nreturn;\n}\n";
        //funcion bool to String
        text+="//t3=boolean\nvoid boolToStr(){\nL0:\nif(t3==1) goto L1;\ngoto L2;\nL1:\nprintf(\"%c\", (char)116);\nprintf(\"%c\", (char)114);\nprintf(\"%c\", (char)117);\nprintf(\"%c\", (char)101);\ngoto L3;\nL2:\nprintf(\"%c\", (char)102);\nprintf(\"%c\", (char)97);\nprintf(\"%c\", (char)108);\nprintf(\"%c\", (char)115);\nprintf(\"%c\", (char)101);\nL3:\nreturn;\n}\n";
        //potencia
        text+="//t0=resultado, t1=exponente, t2=iterador, t3=base\nvoid potencia(){\nt2=1;\nL0:if(t2<t1) goto L1;\ngoto L2;\nL1:\nt0=t3*t0;\nt2=t2+1;\ngoto L0;\nL2:\nreturn;\n}\n";
        //comparar strings
        text+="//t0=cadena1, t1=cadena2, t2=resultado\nvoid compareStrs(){\nL0:\nif(heap[(int)t0]!=-1) goto L1;\ngoto L2;\nL1:\nif(heap[(int)t1]!=-1) goto L3;\ngoto L4;\nL2:\nif(heap[(int)t1]==-1) goto L5;\ngoto L4;\nL3:\nif(heap[(int)t0]!=heap[(int)t1]) goto L4;\nt0=t0+1;\nt1=t1+1;\ngoto L0;\nL4:\nt2=0;\ngoto L6;\nL5:\nt2=1;\nL6:\nreturn;\n}\n";
        //comparar strings
        text+="//t0=cadena1, t1=cadena2, t2=resultado\nvoid diffStrs(){\nL0:\nif(heap[(int)t0]!=-1) goto L1;\ngoto L2;\nL1:\nif(heap[(int)t1]!=-1) goto L3;\ngoto L4;\nL2:\nif(heap[(int)t1]==-1) goto L5;\ngoto L4;\nL3:\nif(heap[(int)t0]!=heap[(int)t1]) goto L4;\nt0=t0+1;\nt1=t1+1;\ngoto L0;\nL4:\nt2=1;\ngoto L6;\nL5:\nt2=0;\nL6:\nreturn;\n}\n";
        return text;
    }
    function declararArregloC3D(arreglo){
        let tipo ="", arrayName="";
        for(let i =0; i<arreglo.tipo.split("[]").length-1;i++){
            tipo+=arreglo.tipo.split("[]")[i];
        }
        switch(arreglo.tipo.split("[]").length){
            case 1: 
                return;
            case 2:
                arrayName = nuevoArreglo(1);
                consola.value+=arrayName+"="+"(double *)malloc("+(arreglo.direcciones.length+1)+"*sizeof(double));\n";
                for(let i =0;i<arreglo.direcciones.length+1;i++){
                    if(i==0){
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones.length+";\n";
                    }else{
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i-1]+";\n";
                    }
                    
                }
                //declarar los arreglos con los elemntos de la dimensión
                arreglo.direcciones=arrayName;
                return arrayName;
            case 3:
                arrayName = nuevoArreglo(2);
                consola.value+=arrayName+"="+"(double *)malloc("+(arreglo.direcciones.length+1)+"*sizeof(double));\n";
                for(let i =0;i<arreglo.direcciones.length+1;i++){
                    if(i==0){
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones.length+";\n";
                    }else{
                        declararArregloC3D({direcciones:arreglo.direcciones[i], tipo:tipo});
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i-1]+";\n";
                    }                    
                }
                //declarar los arreglos con los elemntos de la dimensión
                return arrayName;
            case 4:
                arrayName = nuevoArreglo(3);
                consola.value+=arrayName+"="+"(double *)malloc("+(arreglo.direcciones.length+1)+"*sizeof(double));\n";
                for(let i =0;i<arreglo.direcciones.length+1;i++){
                    if(i==0){
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones.length+";\n";
                    }else{
                        declararArregloC3D({direcciones:arreglo.direcciones[i], tipo:tipo});
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i-1]+";\n";
                    }
                }
                //declarar los arreglos con los elemntos de la dimensión
                return arrayName;
            case 5:
                arrayName = nuevoArreglo(4);
                consola.value+=arrayName+"="+"(double *)malloc("+(arreglo.direcciones.length+1)+"*sizeof(double));\n";        
                for(let i =0;i<arreglo.direcciones.length+1;i++){
                    if(i==0){
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones.length+";\n";
                    }else{
                        declararArregloC3D({direcciones:arreglo.direcciones[i], tipo:tipo});
                        consola.value+=arrayName+"["+i+"]="+arreglo.direcciones[i-1]+";\n";
                    }
                }
                //declarar los arreglos con los elemntos de la dimensión
                return arrayName;
        }
    }
    function traducirFunciones(id, tablaDeSimbolos){
        let tamanio =0, funcion = tsGlobal.obtenerFuncion(id, 0, 0, "Global"), puntero=nuevoTemporal(),label = nuevaEtiqueta();
        consola.value+="//Comienza a declarar los parámetros\n";
        consola.value+=puntero+"=p;\n";
        for(let i =0;i<funcion.parametros.length;i++){
            let temporal =nuevoTemporal(), temporal2=nuevoTemporal();
            consola.value+=temporal+"="+puntero+"+"+(i+1)+";\n";
            consola.value+="p=p+1;\n"
            //consola.value+=temporal2+"=stack[(int)"+temporal+"];\n";
            tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, id, "temp", "temp", temporal);
        }
        if(funcion.parametros.length!=0){
            consola.value+="p=p+1;\n";
            consola.value+="//se adelanta el puntero para las variables del entorno\n";
        }
        consola.value+="//termina de declarar los parámetros\n";
        tamanio+=countDeclarations(funcion.accion);
        procesarBloque(funcion.accion, tablaDeSimbolos,id, undefined, undefined, label);
       // printedTable.erEj=[];
        consola.value+=label+":\nreturn;";
        FuncionesC3D.push({id:id, c3d:consola.value});
        functionDeclaration="void "+id+"(){\n"+consola.value+"\n}\n"+functionDeclaration;
        consola.value="";
    }
    function countDeclarations(instrucciones){
        let contador = 0;
        for(let instruccion of instrucciones){
            if (instruccion.sentencia === SENTENCIAS.DECLARACION) {
                contador++;
            }
        }
        return contador;
    }
    function procesarNewArray(largo, tablaDeSimbolos, ambito, userType){

        consola.value+="//comienza arreglo newArray\n";
        let valor = procesarExpresionNumerica(largo, tablaDeSimbolos, ambito, userType);
        let tamanio=0,temporales=[],arrayHead=contadores.temporales+1;
        temporales.push(nuevoTemporal());
        consola.value+=temporales[tamanio]+"=h;\n";
        consola.value+="h=h+1;\n"
        tamanio++;
        for(let i =0;i<valor.valor;i++){
            temporales.push(nuevoTemporal());
            consola.value+=temporales[tamanio]+"=h;\n";
            consola.value+="h=h+1;\n";
            tamanio++;
        }
        consola.value+="heap[(int)"+temporales[0]+"]="+(tamanio-1)+";\n";
        tamanio=1;
        for(let i =0;i<valor.valor;i++){
            consola.value+="heap[(int)"+temporales[tamanio]+"]=0;\n";
            tamanio++;
        }
        return {tipo:"newArray_"+userType, valor:"t"+arrayHead, direcciones:temporales[0]};
    }
    function importFunctions(){
        funcionesTraducidas = []
        for(let funcion of tsGlobal._simbolos){
            if(funcion.si=="funcion"){
                let tsFuncion = (funcion.id.split("_").length==1)?new TS(JSON.parse(JSON.stringify(tsGlobal._simbolos)), printedTable):Nested(funcion.id);
                traducirFunciones(funcion.id,tsFuncion);
                funcionesTraducidas.push({id:funcion.id, ts:tsFuncion}); 
            }            
        } 
    }
    function Nested(id){
        let padre = "";
        for(let i =0;i<id.split("_").length-1;i++){
            if(i!=0) padre+="_";
            padre+=id.split("_")[i];
        }
        for(let tablas of funcionesTraducidas){
            if(tablas.id.toLowerCase()==padre.toLowerCase()){
                return tablas.ts;
            }
        }
    }
    function strMethods(principalValue, acc, tablaDeSimbolos, ambito){
        let temp = acc;
        while(temp!="Epsilon"){
            if(temp.sentencia==SENTENCIAS.LENGTH){//R
                if(principalValue.tipo.split("[]").length>1 || principalValue.tipo =="string"){
                    if(principalValue.tipo =="string"){
                        consola.value+="t4="+principalValue.valor+";\n";
                        let temporal = nuevoTemporal(), posicion = nuevoTemporal();
                        consola.value+="strLength();\n"
                        consola.value+=temporal+"= t4-"+principalValue.valor+";\n";
                        //consola.value+=posicion+"=h;\n"+pila+"[(int)"+posicion+"]="+temporal+";\n";
                        principalValue.valor= temporal;
                        principalValue.tipo="number";
                    }else{
                        let temporal = nuevoTemporal();
                        consola.value+="//en la posición 0 está el size\n";
                        consola.value+=temporal+"=heap[(int)"+principalValue.valor+"];\n";
                        principalValue.valor=temporal;
                        principalValue.tipo="number";
                    }            
                }else{
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Length a un array inexistente.\n';  
                    printedTable.erEj.push({descripcion:'Intento de Length a un array inexistente.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: Intento de Length a un array inexistente.\n';     
                }                
                //principalValue={valor:principalValue.valor.length, tipo:"number"};
                break;
            }else if(temp.sentencia==SENTENCIAS.CHAR_AT){
                if(principalValue.tipo!="string"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede obtener un CharAt en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede obtener un CharAt en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';  
                    printedTable.erEj.push({descripcion:''+valor.tipo+' no se puede usar como un índice en CharAt',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: '+valor.tipo+' no se puede usar como un índice en CharAt.\n';                    
                }
                let temporal1= nuevoTemporal(),temporal2 = nuevoTemporal(), temporal3=nuevoTemporal();
                consola.value+=temporal1+"="+principalValue.valor+"+"+valor.valor+";\n";
                consola.value+=temporal3+"=heap[(int)"+temporal1+"];\n";
                consola.value+=temporal2+"=h;\nheap[(int)"+temporal2+"]="+temporal3+";\nh=h+1;\nheap[(int)h]=-1;\nh=h+1;\n"
                principalValue.valor=temporal2;
            }else if(temp.sentencia==SENTENCIAS.TO_LOWER_CASE){
                if(principalValue.tipo!="string"){
                    //consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toLowerCase en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';                    
                }
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\nt0="+principalValue.valor+";\n";
                consola.value+="toLowerCase();\n";
                principalValue.valor=temporal;
            }else if(temp.sentencia==SENTENCIAS.TO_UPPER_CASE){
                if(principalValue.tipo!="string"){
                   // consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toLowerCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\nt0="+principalValue.valor+";\n";
                consola.value+="toUpperCase();\n";
                principalValue.valor=temporal;
            }else if(temp.sentencia==SENTENCIAS.CONCAT){
                if(principalValue.tipo!="string"){
                   // consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede realizar un toUpperCase en '+principalValue.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede realizar un toUpperCase en '+principalValue.tipo+'.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                if(valor.tipo!="string"){
                   // consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede concatenar '+valor.tipo+'.\n';  
                    printedTable.erEj.push({descripcion:'No se puede concatenar '+valor.tipo+'.',tipo:"semántico", linea:temp.fila, columna:temp.columna,ambito:ambito});
                    throw '>ERROR: No se puede concatenar '+valor.tipo+'.\n';                    
                }
                let temporal = nuevoTemporal();
                consola.value+=temporal+"=h;\n";
                consola.value+="t1="+principalValue.valor+";\n";
                consola.value+="t3="+valor.valor+";\n";
                consola.value+="concatenar();\n";   
                principalValue.valor=temporal;
            }
            temp=temp.next_acc;
        }
        return {valor: principalValue.valor, tipo:principalValue.tipo, reference:true};   
    }
    function LowerCase(value) {
        if(value!=undefined){
            return value.toString().toLowerCase();
        }
    }
}