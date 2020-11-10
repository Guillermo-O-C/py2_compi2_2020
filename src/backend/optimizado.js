
export default function Optimizar(consola, printedTable, tablero){
    let codigo = consola.value.split("\n");
    try {
        aplicarReglas();
        consola.value=codigo.join("\n");
    } catch (e) {
        console.error(e);
        return;
    }
    function aplicarReglas(){        
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\+(\b)*0(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\b)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\+0/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\b)*0(\b)*\+/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\b)*\+/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/0(\b)*\+/g,'');
                        }
                    }else if(String(codigo[line]).match(/-(\b)*0(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:7, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\b)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/-(\b)*0/g,'');
                        }
                    }else if(String(codigo[line]).match(/\*(\b)*1(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\b)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\*1/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\b)*1(\b)*\*/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\b)*\*/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/1(\b)*\*/g,'');
                        }
                    }else  if(String(codigo[line]).match(/\/(\b)*1(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:9, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\b)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\/(\b)*1/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/\+(\b)*0(\b)*;/)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\b)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\+(\b)*0/g,'');
                    }else if(String(codigo[line]).match(/=(\b)*0(\b)*\+/)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\b)*\+/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/0(\b)*\+/g,'');
                    }else if(String(codigo[line]).match(/-(\b)*0(\b)*;/)!=null){  
                        printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\b)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/-(\b)*0/g,'');
                    }else if(String(codigo[line]).match(/\*(\b)*1(\b)*;/)!=null){  
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\b)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\*(\b)*1/g,'');
                    }else if(String(codigo[line]).match(/=(\b)*1(\b)*\*/)!=null){
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\b)*\*/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/1(\b)*\*/g,'');
                    }else if(String(codigo[line]).match(/\/(\b)*1(\b)*;/)!=null){  
                        printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\b)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\/(\b)*1/g,'');
                    }
                }
            }
        }
    }
    function regla6_10(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\+(\b)*0(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\b)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\+0/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\b)*0(\b)*\+/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:6, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\b)*\+/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/0(\b)*\+/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/\+(\b)*0(\b)*;/)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\+(\b)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\+(\b)*0/g,'');
                    }else if(String(codigo[line]).match(/=(\b)*0(\b)*\+/)!=null){
                        printedTable.opt.push({regla:10, eliminado:codigo[line], agregado:String(codigo[line]).replace(/0(\b)*\+/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/0(\b)*\+/g,'');
                    }
                }
                
            }            
        }
    }
    function regla7_11(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/-(\b)*0(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:7, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\b)*0/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/-(\b)*0/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/-(\b)*0(\b)*;/)!=null){  
                        printedTable.opt.push({regla:11, eliminado:codigo[line], agregado:String(codigo[line]).replace(/-(\b)*0/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/-(\b)*0/g,'');
                    }
                }
                
            }            
        }
    }
    function regla8_12(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\*(\b)*1(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\b)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\*1/g,'');
                        }
                    }else if(String(codigo[line]).match(/=(\b)*1(\b)*\*/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:8, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\b)*\*/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/1(\b)*\*/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/\*(\b)*1(\b)*;/)!=null){  
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\*(\b)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\*(\b)*1/g,'');
                    }else if(String(codigo[line]).match(/=(\b)*1(\b)*\*/)!=null){
                        printedTable.opt.push({regla:12, eliminado:codigo[line], agregado:String(codigo[line]).replace(/1(\b)*\*/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/1(\b)*\*/g,'');
                    }
                }
                
            }            
        }
    }    
    function regla9_13(){
        for(let line in codigo){
            if(String(codigo[line]).match(/\/\//)==null){
                let stack = String(codigo[line]).match(/stack/);
                let heap = String(codigo[line]).match(/heap/);
                if(stack==null && heap == null){//operaciones entre temporales
                    if(String(codigo[line]).match(/\/(\b)*1(\b)*;/)!=null){
                        let identificadores = String(codigo[line]).match(/t\d+/g);
                        if(identificadores[0]==identificadores[1]){
                            printedTable.opt.push({regla:9, eliminado:codigo[line], agregado:'', fila:line});
                            codigo[line]="";
                        }else{
                            printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\b)*1/g,''), fila:line});
                            codigo[line]=String(codigo[line]).replace(/\/(\b)*1/g,'');
                        }
                    }
                }else{
                    if(String(codigo[line]).match(/\/(\b)*1(\b)*;/)!=null){  
                        printedTable.opt.push({regla:13, eliminado:codigo[line], agregado:String(codigo[line]).replace(/\/(\b)*1/g,''), fila:line});
                        codigo[line]=String(codigo[line]).replace(/\/(\b)*1/g,'');
                    }
                }
                
            }            
        }
    }    
}