import { generate } from 'astring'
import type { ExportNamedDeclaration, Expression, ImportDeclaration, Pattern, Program, Property, SpreadElement, Statement, VariableDeclaration } from 'estree'

function getDeclaredNamesProperty(property: Property | SpreadElement) {
  if (property.type === 'SpreadElement') {
    return getExternalIdentifiersExpression(property.argument, [])[0]
  }

  if (property.value.type === 'Identifier') {
    return [property.value.name]
  }

  return []
}

function getDeclaredNamesPattern(pattern: Pattern): string[] {
  if (pattern.type === 'ArrayPattern') {
    return pattern.elements
      .filter((v): v is NonNullable<typeof v> => v != null)
      .flatMap(getDeclaredNamesPattern)
  } else if (pattern.type === 'AssignmentPattern') {
    //
  } else if (pattern.type === 'Identifier') {
    return [pattern.name]
  } else if (pattern.type === 'MemberExpression') {
    //
  } else if (pattern.type === 'ObjectPattern') {
    return pattern.properties
      .flatMap((p) => p.type === 'Property' ? getDeclaredNamesProperty(p) : getDeclaredNamesPattern(p.argument))
  } else if (pattern.type === 'RestElement') {
    return getDeclaredNamesPattern(pattern.argument)
  }
  return []
}

function getExternalIdentifiersVariableDeclaration(varDeclaration: VariableDeclaration, parentDecls: string[]) {
  const decl = []
  const externalRefs = []
  for (const declaration of varDeclaration.declarations) {
    decl.push(...getDeclaredNamesPattern(declaration.id))
    if (declaration.init != null) {
      const [a, b] = getExternalIdentifiersExpression(declaration.init, parentDecls)
      decl.push(...a)
      externalRefs.push(...b)
    }
  }
  return [decl, externalRefs] as readonly [decl: string[], externalRefs: string[]]
}

function getExternalIdentifiersExpression(expression: Expression, parentDecls: string[]) {
  const decl: string[] = [...parentDecls]
  const externalRefs: string[] = []
  if (expression.type === 'ArrayExpression') {
    for (const el of expression.elements) {
      if (el?.type === 'SpreadElement') {
        decl.push(...getDeclaredNamesProperty(el))
      } else if (el != null) {
        const [a, b] = getExternalIdentifiersExpression(el, parentDecls)
        decl.push(...a)
        externalRefs.push(...b)
      }
    }
  } else if (expression.type === 'ArrowFunctionExpression') {
    decl.push(...expression.params.flatMap((param) => getDeclaredNamesPattern(param)))
    if (expression.body.type === 'BlockStatement') {
      externalRefs.push(...getExternalIdentifiers(expression.body.body, decl))
    } else {
      externalRefs.push(...getExternalIdentifiersExpression(expression.body, decl)[1])
    }
  } else if (expression.type === 'AssignmentExpression') {
    decl.push(...getDeclaredNamesPattern(expression.left))
    const [a, b] = getExternalIdentifiersExpression(expression.right, parentDecls)
    decl.push(...a)
    externalRefs.push(...b)
  } else if (expression.type === 'AwaitExpression') {
    return getExternalIdentifiersExpression(expression.argument, parentDecls)
  } else if (expression.type === 'BinaryExpression') {
    if (expression.left.type !== 'PrivateIdentifier') {
      const [, b] = getExternalIdentifiersExpression(expression.left, decl)
      externalRefs.push(...b)
    }

    const [, b] = getExternalIdentifiersExpression(expression.right, decl)
    externalRefs.push(...b)
  } else if (expression.type === 'CallExpression') {
    if (expression.callee.type !== 'Super') {
      const [a, b] = getExternalIdentifiersExpression(expression.callee, parentDecls)
      decl.push(...a)
      externalRefs.push(...b)
    }

    for (const arg of expression.arguments) {
      if (arg.type === 'SpreadElement') {
        decl.push(...getDeclaredNamesProperty(arg))
      } else {
        const [a, b] = getExternalIdentifiersExpression(arg, parentDecls)
        decl.push(...a)
        externalRefs.push(...b)
      }
    }
  } else if (expression.type === 'ChainExpression') {
    if (expression.expression.type === 'CallExpression') {
      if (expression.expression.callee.type !== 'Super') {
        const [, a] = getExternalIdentifiersExpression(expression.expression.callee, decl)
        externalRefs.push(...a)
      }

      const u = expression.expression.arguments
        .flatMap((arg) => arg.type === 'SpreadElement' ? getDeclaredNamesProperty(arg) : getExternalIdentifiersExpression(arg, decl)[1])
      externalRefs.push(...u)
    } else if (expression.expression.type === 'MemberExpression') {
      if (expression.expression.object.type !== 'Super') {
        const [, a] = getExternalIdentifiersExpression(expression.expression.object, decl)
        externalRefs.push(...a)
      }

      /* if (expression.expression.property.type !== 'PrivateIdentifier' && expression.expression.property.type !== 'Identifier') {
        const [, a] = getExternalIdentifiersExpression(expression.expression.property, decl)
        externalRefs.push(...a)
      } */
    }
  } else if (expression.type === 'ClassExpression') {
    //
  } else if (expression.type === 'ConditionalExpression') {
    const [a, b] = getExternalIdentifiersExpression(expression.test, parentDecls)
    decl.push(...a)
    externalRefs.push(...b)
    const [c, d] = getExternalIdentifiersExpression(expression.consequent, parentDecls)
    decl.push(...c)
    externalRefs.push(...d)
    const [e, f] = getExternalIdentifiersExpression(expression.alternate, parentDecls)
    decl.push(...e)
    externalRefs.push(...f)
  } else if (expression.type === 'FunctionExpression') {
    decl.push(...expression.params.flatMap((param) => getDeclaredNamesPattern(param)))
    externalRefs.push(...getExternalIdentifiers(expression.body.body, decl))
  } else if (expression.type === 'Identifier') {
    if (!parentDecls.includes(expression.name)) {
      externalRefs.push(expression.name)
    }
  } else if (expression.type === 'ImportExpression') {
    return getExternalIdentifiersExpression(expression.source, parentDecls)
  } else if (expression.type === 'Literal') {
    //
  } else if (expression.type === 'LogicalExpression') {
    const [a, b] = getExternalIdentifiersExpression(expression.left, parentDecls)
    decl.push(...a)
    externalRefs.push(...b)
    const [c, d] = getExternalIdentifiersExpression(expression.right, parentDecls)
    decl.push(...c)
    externalRefs.push(...d)
  } else if (expression.type === 'MemberExpression') {
    if (expression.object.type !== 'Super') {
      const [a, b] = getExternalIdentifiersExpression(expression.object, parentDecls)
      decl.push(...a)
      externalRefs.push(...b)
    }

    /* if (expression.property.type !== 'PrivateIdentifier') {
      const [a, b] = getExternalIdentifiersExpression(expression.property, parentDecls)
      decl.push(...a)
      externalRefs.push(...b)
    } */
  } else if (expression.type === 'MetaProperty') {
    //
  } else if (expression.type === 'NewExpression') {
    if (expression.callee.type !== 'Super') {
      const [a, b] = getExternalIdentifiersExpression(expression.callee, parentDecls)
      decl.push(...a)
      externalRefs.push(...b)
    }
  } else if (expression.type === 'ObjectExpression') {
    decl.push(...expression.properties.flatMap(getDeclaredNamesProperty))
  } else if (expression.type === 'SequenceExpression') {
    externalRefs.push(...expression.expressions.flatMap((ex) => getExternalIdentifiersExpression(ex, decl)[1]))
  } else if (expression.type === 'TaggedTemplateExpression') {
    externalRefs.push(...getExternalIdentifiersExpression(expression.tag, decl)[1])
    externalRefs.push(...getExternalIdentifiersExpression(expression.quasi, decl)[1])
  } else if (expression.type === 'TemplateLiteral') {
    externalRefs.push(...expression.expressions.flatMap((ex) => getExternalIdentifiersExpression(ex, decl)[1]))
  } else if (expression.type === 'ThisExpression') {
    //
  } else if (expression.type === 'UnaryExpression') {
    const [a, b] = getExternalIdentifiersExpression(expression.argument, parentDecls)
    decl.push(...a)
    externalRefs.push(...b)
  } else if (expression.type === 'UpdateExpression') {
    const [a, b] = getExternalIdentifiersExpression(expression.argument, parentDecls)
    decl.push(...a)
    externalRefs.push(...b)
  } else if (expression.type === 'YieldExpression') {
    if (expression.argument != null) {
      const [, a] = getExternalIdentifiersExpression(expression.argument, decl)
      externalRefs.push(...a)
    }
  }
  return [decl, externalRefs] as readonly [decl: string[], externalRefs: string[]]
}

export function getExternalIdentifiers(stmts: Statement[], parentDecls: string[]): string[] {
  const decl: string[] = [...parentDecls]
  const externalRefs: string[] = []
  for (const stmt of stmts) {
    if (stmt.type === 'BlockStatement') {
      externalRefs.push(...getExternalIdentifiers(stmt.body, decl))
    } else if (stmt.type === 'ClassDeclaration') {
      //
    } else if (stmt.type === 'DoWhileStatement') {
      const [testDecl, testExternalRefs] = getExternalIdentifiersExpression(stmt.test, decl)
      externalRefs.push(...testExternalRefs)
      externalRefs.push(...getExternalIdentifiers([stmt.body], [...decl, ...testDecl]))
    } else if (stmt.type === 'ExpressionStatement') {
      const [, exprExternalRefs] = getExternalIdentifiersExpression(stmt.expression, decl)
      externalRefs.push(...exprExternalRefs)
    } else if (stmt.type === 'ForInStatement' || stmt.type === 'ForOfStatement') {
      const [a, b] = getExternalIdentifiersExpression(stmt.right, decl)
      decl.push(...a)
      externalRefs.push(...b)
      if (stmt.left.type === 'VariableDeclaration') {
        const [a, b] = getExternalIdentifiersVariableDeclaration(stmt.left, decl)
        decl.push(...a)
        externalRefs.push(...b)
      } else {
        decl.push(...getDeclaredNamesPattern(stmt.left))
      }

      externalRefs.push(...getExternalIdentifiers([stmt.body], decl))
    } else if (stmt.type === 'ForStatement') {
      if (stmt.init?.type === 'VariableDeclaration') {
        const [a, b] = getExternalIdentifiersVariableDeclaration(stmt.init, decl)
        decl.push(...a)
        externalRefs.push(...b)
      } else if (stmt.init != null) {
        const [a, b] = getExternalIdentifiersExpression(stmt.init, decl)
        decl.push(...a)
        externalRefs.push(...b)
      }

      if (stmt.test != null) {
        const [, a] = getExternalIdentifiersExpression(stmt.test, decl)
        externalRefs.push(...a)
      }

      if (stmt.update != null) {
        const [, a] = getExternalIdentifiersExpression(stmt.update, decl)
        externalRefs.push(...a)
      }

      externalRefs.push(...getExternalIdentifiers([stmt.body], decl))
    } else if (stmt.type === 'FunctionDeclaration') {
      decl.push(...stmt.params.flatMap((param) => getDeclaredNamesPattern(param)))
      externalRefs.push(...getExternalIdentifiers(stmt.body.body, decl))
    } else if (stmt.type === 'IfStatement') {
      const [a, b] = getExternalIdentifiersExpression(stmt.test, decl)
      externalRefs.push(...b)
      const [, c] = getExternalIdentifiers([stmt.consequent], [...decl, ...a])
      externalRefs.push(...c)
      if (stmt.alternate) {
        const [, d] = getExternalIdentifiers([stmt.consequent], decl)
        externalRefs.push(...d)
      }
    } else if (stmt.type === 'ReturnStatement') {
      if (stmt.argument != null) {
        const [, a] = getExternalIdentifiersExpression(stmt.argument, decl)
        externalRefs.push(...a)
      }
    } else if (stmt.type === 'StaticBlock') {
      externalRefs.push(...getExternalIdentifiers(stmt.body, decl))
    } else if (stmt.type === 'ThrowStatement') {
      const [, a] = getExternalIdentifiersExpression(stmt.argument, decl)
      externalRefs.push(...a)
    } else if (stmt.type === 'SwitchStatement') {
      //
    } else if (stmt.type === 'TryStatement') {
      externalRefs.push(...getExternalIdentifiers(stmt.block.body, decl))
      if (stmt.handler != null) {
        const newDecl = stmt.handler.param ? getDeclaredNamesPattern(stmt.handler.param) : []
        externalRefs.push(...getExternalIdentifiers(stmt.handler.body.body, [...decl, ...newDecl]))
      }
      if (stmt.finalizer) {
        externalRefs.push(...getExternalIdentifiers(stmt.finalizer.body, decl))
      }
    } else if (stmt.type === 'VariableDeclaration') {
      for (const declaration of stmt.declarations) {
        decl.push(...getDeclaredNamesPattern(declaration.id))
        if (declaration.init) {
          const [, initExternalRefs] = getExternalIdentifiersExpression(declaration.init, decl)
          externalRefs.push(...initExternalRefs)
        }
      }
    } else if (stmt.type === 'WhileStatement') {
      const [a, b] = getExternalIdentifiersExpression(stmt.test, decl)
      decl.push(...a)
      externalRefs.push(...b)

      externalRefs.push(...getExternalIdentifiers([stmt.body], decl))
    } else if (stmt.type === 'WithStatement') {
      //
    }
  }
  return externalRefs
}

const exportsToRemove = Object.freeze(['loader', 'metadata'])
export const transformPage = (ast: Program) => {
  const ssrExports = ast.body
    .filter((el): el is ExportNamedDeclaration =>
      el.type === 'ExportNamedDeclaration'
        && el.declaration != null
        && (
          (el.declaration.type === 'FunctionDeclaration' && exportsToRemove.includes(el.declaration.id.name))
            || (
              el.declaration.type === 'VariableDeclaration'
                && getDeclaredNamesPattern(el.declaration.declarations[0].id).some((n) => exportsToRemove.includes(n))
            )
        ),
    )
  const asd = ssrExports.flatMap((el) => {
    let name: string
    if (el.declaration?.type === 'FunctionDeclaration') {
      name = el.declaration.id.name
      return getExternalIdentifiers([el.declaration], [])
    } else if (el.declaration?.type === 'VariableDeclaration') {
      const { id, init } = el.declaration.declarations[0]
      name = id.type === 'Identifier' ? id.name : '???'
      if (init?.type === 'ArrowFunctionExpression') {
        return getExternalIdentifiersExpression(init, [])[1]
      } else if (init?.type === 'FunctionExpression') {
        return getExternalIdentifiersExpression(init, [])[1]
      } else if (init?.type === 'AssignmentExpression') {
        return getExternalIdentifiersExpression(init.right, [])[1]
      } else if (init?.type === 'ObjectExpression') {
        return getExternalIdentifiersExpression(init, [])[1]
      } else {
        throw new Error(`Unsupported expression for ${name}: must be a function or value assignment`)
      }
    } else {
      throw new Error('???')
    }
  })
  const importsToRemove = ast.body.filter((el): el is ImportDeclaration =>
    el.type === 'ImportDeclaration'
      && typeof el.source.value === 'string'
      && el.source.value.match(/^node:/) != null,
  )
  for (const importDeclaration of ast.body.filter((el) => el.type === 'ImportDeclaration')) {
    const prevLength = importDeclaration.specifiers.length
    importDeclaration.specifiers = importDeclaration.specifiers
      .filter((specifier) => !asd.includes(specifier.local.name))
    if (prevLength > 0 && importDeclaration.specifiers.length === 0) {
      importsToRemove.push(importDeclaration)
    }
  }

  ast.body = ast.body
    .filter((el) => !ssrExports.includes(el as never) && !importsToRemove.includes(el as never))
  const newCode = generate(ast, { comments: true })
  return newCode
}
