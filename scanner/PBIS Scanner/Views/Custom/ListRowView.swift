//
//  ListRowView.swift
//  PBIS Scanner
//
//  Created by Jaron Schreiber on 8/31/20.
//  Copyright © 2020 DxHub. All rights reserved.
//

import SwiftUI

struct ListRowView: View {
    let key: Text
    let value: Text

    var body: some View {
        HStack {
            key; Spacer(); value
        }
    }
}

struct ListRowView_Previews: PreviewProvider {
    static var previews: some View {
        ListRowView(key: Text("key"), value: Text("value"))
    }
}
