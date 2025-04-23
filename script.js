// 頁面載入時創建初始矩陣
window.onload = function() {
    createMatrixA();
    createMatrixB();
    updateInterfaceBasedOnOperation();
};

// 監聽操作選擇變化
document.getElementById('operation').addEventListener('change', updateInterfaceBasedOnOperation);

// 根據選擇的操作更新界面
function updateInterfaceBasedOnOperation() {
    const operation = document.getElementById('operation').value;
    const matrixBSection = document.getElementById('matrix-b-section');

    // 需要兩個矩陣的操作
    if (operation === 'addition' || operation === 'subtraction' || operation === 'multiplication') {
        matrixBSection.style.display = 'flex';
    } else {
        // 只需要一個矩陣的操作
        matrixBSection.style.display = 'none';
    }
}

// 創建矩陣 A
function createMatrixA() {
    const rows = parseInt(document.getElementById('rows-a').value);
    const cols = parseInt(document.getElementById('cols-a').value);
    createMatrix('a', rows, cols);
}

// 創建矩陣 B
function createMatrixB() {
    const rows = parseInt(document.getElementById('rows-b').value);
    const cols = parseInt(document.getElementById('cols-b').value);
    createMatrix('b', rows, cols);
}

// 創建矩陣輸入框
function createMatrix(id, rows, cols) {
    const container = document.getElementById(`matrix-${id}-container`);
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'matrix-table';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = (i === j) ? 1 : 0; // 默認值為單位矩陣
            input.id = `${id}-${i}-${j}`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        
        table.appendChild(row);
    }
    
    container.appendChild(table);
}

// 從輸入框讀取矩陣數據
function getMatrixData(id, rows, cols) {
    const matrix = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`${id}-${i}-${j}`).value);
            row.push(isNaN(value) ? 0 : value);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// 計算結果
function calculateResult() {
    const operation = document.getElementById('operation').value;
    const rowsA = parseInt(document.getElementById('rows-a').value);
    const colsA = parseInt(document.getElementById('cols-a').value);
    const matrixA = getMatrixData('a', rowsA, colsA);
    
    let result;
    let resultText = '';
    
    try {
        switch (operation) {
            case 'addition':
                const rowsB = parseInt(document.getElementById('rows-b').value);
                const colsB = parseInt(document.getElementById('cols-b').value);
                
                if (rowsA !== rowsB || colsA !== colsB) {
                    throw new Error("矩陣加法需要兩個矩陣尺寸相同");
                }
                
                const matrixB = getMatrixData('b', rowsB, colsB);
                result = addMatrices(matrixA, matrixB);
                resultText = matrixToHTML(result);
                break;
                
            case 'subtraction':
                const rowsB2 = parseInt(document.getElementById('rows-b').value);
                const colsB2 = parseInt(document.getElementById('cols-b').value);
                
                if (rowsA !== rowsB2 || colsA !== colsB2) {
                    throw new Error("矩陣減法需要兩個矩陣尺寸相同");
                }
                
                const matrixB2 = getMatrixData('b', rowsB2, colsB2);
                result = subtractMatrices(matrixA, matrixB2);
                resultText = matrixToHTML(result);
                break;
                
            case 'multiplication':
                const rowsB3 = parseInt(document.getElementById('rows-b').value);
                const colsB3 = parseInt(document.getElementById('cols-b').value);
                
                if (colsA !== rowsB3) {
                    throw new Error("矩陣乘法需要第一個矩陣的列數等於第二個矩陣的行數");
                }
                
                const matrixB3 = getMatrixData('b', rowsB3, colsB3);
                result = multiplyMatrices(matrixA, matrixB3);
                resultText = matrixToHTML(result);
                break;
                
            case 'determinant':
                if (rowsA !== colsA) {
                    throw new Error("計算行列式需要方陣");
                }
                
                result = determinant(matrixA);
                resultText = `行列式 |A| = ${result}`;
                break;
                
            case 'inverse':
                if (rowsA !== colsA) {
                    throw new Error("計算逆矩陣需要方陣");
                }
                
                const det = determinant(matrixA);
                if (Math.abs(det) < 1e-10) {
                    throw new Error("矩陣不可逆（行列式為零）");
                }
                
                result = inverseMatrix(matrixA);
                resultText = matrixToHTML(result);
                break;
                
            case 'transpose':
                result = transposeMatrix(matrixA);
                resultText = matrixToHTML(result);
                break;
                
            case 'rref':
                result = rref(matrixA);
                resultText = matrixToHTML(result);
                break;
                
            case 'eigen':
                if (rowsA !== colsA) {
                    throw new Error("計算特徵值需要方陣");
                }
                
                if (rowsA > 3) {
                    throw new Error("目前只支持 3x3 或更小的矩陣計算特徵值");
                }
                
                resultText = "特徵值計算功能正在開發中。請使用其他矩陣計算功能。";
                break;
        }
        
        document.getElementById('result-output').innerHTML = resultText;
    } catch (error) {
        document.getElementById('result-output').innerHTML = `<div style="color: red;">${error.message}</div>`;
    }
}

// 矩陣加法
function addMatrices(matrixA, matrixB) {
    const result = [];
    
    for (let i = 0; i < matrixA.length; i++) {
        const row = [];
        for (let j = 0; j < matrixA[0].length; j++) {
            row.push(matrixA[i][j] + matrixB[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

// 矩陣減法
function subtractMatrices(matrixA, matrixB) {
    const result = [];
    
    for (let i = 0; i < matrixA.length; i++) {
        const row = [];
        for (let j = 0; j < matrixA[0].length; j++) {
            row.push(matrixA[i][j] - matrixB[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

// 矩陣乘法
function multiplyMatrices(matrixA, matrixB) {
    const result = [];
    
    for (let i = 0; i < matrixA.length; i++) {
        const row = [];
        for (let j = 0; j < matrixB[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }
    
    return result;
}

// 計算行列式
function determinant(matrix) {
    const n = matrix.length;
    
    if (n === 1) {
        return matrix[0][0];
    }
    
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let j = 0; j < n; j++) {
        const minor = [];
        for (let i = 1; i < n; i++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                if (k !== j) {
                    row.push(matrix[i][k]);
                }
            }
            minor.push(row);
        }
        det += Math.pow(-1, j) * matrix[0][j] * determinant(minor);
    }
    
    return det;
}

// 計算逆矩陣
function inverseMatrix(matrix) {
    const n = matrix.length;
    const det = determinant(matrix);
    
    if (Math.abs(det) < 1e-10) {
        throw new Error("矩陣不可逆（行列式為零）");
    }
    
    if (n === 1) {
        return [[1 / matrix[0][0]]];
    }
    
    const adjoint = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            const minor = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const minorRow = [];
                    for (let l = 0; l < n; l++) {
                        if (l !== j) {
                            minorRow.push(matrix[k][l]);
                        }
                    }
                    minor.push(minorRow);
                }
            }
            row.push(Math.pow(-1, i + j) * determinant(minor));
        }
        adjoint.push(row);
    }
    
    // 轉置伴隨矩陣
    const adjointTranspose = transposeMatrix(adjoint);
    
    // 計算逆矩陣
    const inverse = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(adjointTranspose[i][j] / det);
        }
        inverse.push(row);
    }
    
    return inverse;
}

// 矩陣轉置
function transposeMatrix(matrix) {
    const result = [];
    
    for (let j = 0; j < matrix[0].length; j++) {
        const row = [];
        for (let i = 0; i < matrix.length; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

// 行簡化梯形式 (RREF)
function rref(matrix) {
    const m = [...matrix.map(row => [...row])]; // 深拷貝
    const rows = m.length;
    const cols = m[0].length;
    
    let lead = 0;
    
    for (let r = 0; r < rows; r++) {
        if (lead >= cols) {
            return m;
        }
        
        let i = r;
        while (Math.abs(m[i][lead]) < 1e-10) {
            i++;
            if (i === rows) {
                i = r;
                lead++;
                if (lead === cols) {
                    return m;
                }
            }
        }
        
        // 交換行
        [m[i], m[r]] = [m[r], m[i]];
        
        // 將主元素歸一
        let val = m[r][lead];
        for (let j = 0; j < cols; j++) {
            m[r][j] /= val;
        }
        
        // 消去其他行的該列元素
        for (let i = 0; i < rows; i++) {
            if (i !== r) {
                val = m[i][lead];
                for (let j = 0; j < cols; j++) {
                    m[i][j] -= val * m[r][j];
                }
            }
        }
        
        lead++;
    }
    
    return m;
}

// 將矩陣轉換為HTML表格顯示
function matrixToHTML(matrix) {
    let html = '<table class="matrix-result-table">';
    
    for (let i = 0; i < matrix.length; i++) {
        html += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            // 處理小數點，最多顯示4位小數
            const value = Math.abs(matrix[i][j]) < 1e-10 ? 0 : matrix[i][j];
            const roundedValue = Math.round(value * 10000) / 10000;
            html += `<td class="result-td">${roundedValue}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
}